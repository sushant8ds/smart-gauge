import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GaugeData {
  gage_id: string;
  description: string;
  type: string | null;
  unit_of_meas: string | null;
  calib_freq: number;
  calib_freq_uom: string;
  last_cal_date: string;
  storage_location: string | null;
  current_location: string | null;
  calibrator: string | null;
  baseline_usage_rate: number;
  current_usage_rate: number;
}

// ML Logic: Calculate adjusted calibration interval
function calculateAdjustedInterval(
  baselineFreq: number,
  freqUOM: string,
  baselineUsage: number,
  currentUsage: number,
  k: number = 0.5 // sensitivity factor
): number {
  const usageRatio = currentUsage / baselineUsage;
  const baselineIntervalDays = freqUOM === 'months' ? baselineFreq * 30 : baselineFreq * 365;
  
  // Inverse relationship: higher usage = shorter interval
  const adjustedInterval = baselineIntervalDays / (1 + k * (usageRatio - 1));
  
  return Math.max(1, Math.round(adjustedInterval)); // Minimum 1 day
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Parse CSV/Excel file
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(/,|\t/).map(h => h.trim().replace(/"/g, ''));
    
    console.log('Headers:', headers);

    const gauges: GaugeData[] = [];
    const notifications: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/,|\t/).map(v => v.trim().replace(/"/g, ''));
      
      if (values.length < 5) continue;

      const gageId = values[0];
      const description = values[1];
      const lastCalDate = values[6];
      const calibFreq = parseInt(values[8]) || 12;
      const calibFreqUOM = values[9] || 'months';
      const baselineUsage = parseFloat(values[10]) || 1;
      const currentUsage = parseFloat(values[11]) || 1;

      // Calculate adjusted interval using ML logic
      const adjustedIntervalDays = calculateAdjustedInterval(
        calibFreq,
        calibFreqUOM,
        baselineUsage,
        currentUsage
      );

      // Calculate next due date
      const lastCal = new Date(lastCalDate);
      const nextDueDate = new Date(lastCal);
      nextDueDate.setDate(nextDueDate.getDate() + adjustedIntervalDays);

      // Determine status
      const today = new Date();
      const daysUntilDue = Math.floor((nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let status = 1; // Current
      if (daysUntilDue < 0) status = 0; // Overdue
      else if (daysUntilDue <= 7) status = 2; // Upcoming
      else if (daysUntilDue > 30) status = 3; // Future

      gauges.push({
        gage_id: gageId,
        description: description,
        type: values[2] || null,
        unit_of_meas: values[3] || null,
        calib_freq: calibFreq,
        calib_freq_uom: calibFreqUOM,
        last_cal_date: lastCalDate,
        storage_location: values[4] || null,
        current_location: values[5] || null,
        calibrator: values[7] || null,
        baseline_usage_rate: baselineUsage,
        current_usage_rate: currentUsage,
      });

      // Upsert gauge data
      const { error: gaugeError } = await supabase
        .from('gauges')
        .upsert({
          gage_id: gageId,
          description: description,
          type: values[2] || null,
          unit_of_meas: values[3] || null,
          calib_freq: calibFreq,
          calib_freq_uom: calibFreqUOM,
          last_cal_date: lastCalDate,
          next_due_date: nextDueDate.toISOString().split('T')[0],
          storage_location: values[4] || null,
          current_location: values[5] || null,
          calibrator: values[7] || null,
          baseline_usage_rate: baselineUsage,
          current_usage_rate: currentUsage,
          adjusted_interval_days: adjustedIntervalDays,
          status: status,
        }, { onConflict: 'gage_id' });

      if (gaugeError) {
        console.error('Error upserting gauge:', gaugeError);
      }

      // Create notification records
      if (status === 0) {
        notifications.push({
          gage_id: gageId,
          notification_type: 'Missed',
          message: `Gauge ${gageId} calibration is overdue by ${Math.abs(daysUntilDue)} days!`,
        });
      } else if (status === 2) {
        notifications.push({
          gage_id: gageId,
          notification_type: 'Upcoming',
          message: `Gauge ${gageId} calibration due in ${daysUntilDue} days.`,
        });
      }
    }

    // Send notifications
    if (notifications.length > 0) {
      await supabase.functions.invoke('send-notifications', {
        body: { notifications },
      });
    }

    console.log(`Processed ${gauges.length} gauges, ${notifications.length} notifications`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: gauges.length,
        notifications: notifications.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error processing upload:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
