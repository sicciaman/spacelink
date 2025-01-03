select
  cron.schedule(
    'process-notifications',
    '* * * * *',
    $$
    select
      net.http_post(
          url:='https://eoteacbcokgswnjkbudu.supabase.co/functions/v1/process-notifications',
          headers:=jsonb_build_object('Content-Type','application/json', 'Authorization', 'Bearer ' || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdGVhY2Jjb2tnc3duamtidWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzOTk5ODcsImV4cCI6MjA1MDk3NTk4N30.wSdd6IDfZKyUBgWMFIidkZMQ_SKl-8lNNE67Cg62MFE'),
          body:=jsonb_build_object('time', now() ),
          timeout_milliseconds:=5000
      ) as request_id;
    $$
  );
