-- Create gauges table
CREATE TABLE public.gauges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gage_id TEXT NOT NULL UNIQUE,
  description TEXT,
  status INTEGER,
  type TEXT,
  unit_of_meas TEXT,
  storage_location TEXT,
  current_location TEXT,
  last_calibrated_by TEXT,
  calibrator TEXT,
  calib_freq INTEGER NOT NULL,
  calib_freq_uom TEXT NOT NULL,
  last_cal_date DATE NOT NULL,
  next_due_date DATE NOT NULL,
  baseline_usage_rate NUMERIC DEFAULT 1,
  current_usage_rate NUMERIC DEFAULT 1,
  adjusted_interval_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create usage_logs table to track usage patterns
CREATE TABLE public.usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gage_id TEXT NOT NULL REFERENCES public.gauges(gage_id) ON DELETE CASCADE,
  usage_count INTEGER NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create calibration_history table
CREATE TABLE public.calibration_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gage_id TEXT NOT NULL REFERENCES public.gauges(gage_id) ON DELETE CASCADE,
  calibration_date DATE NOT NULL,
  calibrated_by TEXT,
  next_due_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification_log table
CREATE TABLE public.notification_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gage_id TEXT NOT NULL REFERENCES public.gauges(gage_id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  channel TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.gauges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calibration_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (since this is a management system)
CREATE POLICY "Allow all access to gauges" ON public.gauges FOR ALL USING (true);
CREATE POLICY "Allow all access to usage_logs" ON public.usage_logs FOR ALL USING (true);
CREATE POLICY "Allow all access to calibration_history" ON public.calibration_history FOR ALL USING (true);
CREATE POLICY "Allow all access to notification_log" ON public.notification_log FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gauges_updated_at
BEFORE UPDATE ON public.gauges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_gauges_next_due_date ON public.gauges(next_due_date);
CREATE INDEX idx_gauges_gage_id ON public.gauges(gage_id);
CREATE INDEX idx_usage_logs_gage_id ON public.usage_logs(gage_id);
CREATE INDEX idx_calibration_history_gage_id ON public.calibration_history(gage_id);