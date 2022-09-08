import httpDownload from "../api/httpDownload";

export default {
  download: async function (params) {
    let jsonData = JSON.stringify(params);
    let info = jsonData;
    let response = await httpDownload.outputReport(info, "weeklyReport.zip");
    return response;
  },
};
