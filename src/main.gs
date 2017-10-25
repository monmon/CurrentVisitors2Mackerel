function run() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const profileId = scriptProperties.getProperty('PROFILE_ID');
  const mackerel = {
    apiKey: scriptProperties.getProperty('MACKEREL_API_KEY'),
    serviceName: scriptProperties.getProperty('MACKEREL_SERVICE_NAME')
  };
  const websiteName = scriptProperties.getProperty('WEBSITE_NAME');

  const response = Analytics.Data.Realtime.get("ga:" + profileId, "rt:activeUsers", {dimensions: "rt:region"});

  const time = parseInt(Date.now()/1000, 10);
  const regions = response.rows.map(function(row) {
    const m = /^([^\s]+)/.exec(row[0]);
    return {
      name: websiteName + "." + m[1],
      time: time,
      value: +row[1]
    };
  });

  const data = [{
    name: websiteName + ".current_visitors",
    time: time,
    value: +response.totalsForAllResults["rt:activeUsers"]
  }].concat(regions);
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
