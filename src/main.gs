function run() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const profileId = scriptProperties.getProperty('PROFILE_ID');
  const mackerel = {
    apiKey: scriptProperties.getProperty('MACKEREL_API_KEY'),
    serviceName: scriptProperties.getProperty('MACKEREL_SERVICE_NAME')
  };
  const websiteName = scriptProperties.getProperty('WEBSITE_NAME');

  const response = Analytics.Data.Realtime.get("ga:" + profileId, "ga:activeVisitors");
  const data = [{
    name: websiteName + ".current_visitors",
    time: parseInt(Date.now()/1000, 10),
    value: (response && response.rows && response.rows.length && response.rows[0].length) ? +response.rows[0][0] : 0
  }];
  const options = {
   method: 'post',
   contentType: 'application/json',
   headers: {
     'X-Api-Key': mackerel.apiKey
   },
   payload: JSON.stringify(data)
 };
 UrlFetchApp.fetch("https://api.mackerelio.com/api/v0/services/" + mackerel.serviceName + "/tsdb", options);
}
