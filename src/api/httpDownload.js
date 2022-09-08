import axios from "axios";
import service from "./api";

const HttpDownload = {};

for (let key in service) {
  let api = service[key];

  if (api.method !== "download") continue;

  HttpDownload[key] = async function (params = {}, fileName = "file.csv", func, reject) {
    await axios({
      method: "post",
      url: process.env.VUE_APP_BASE_API + api.url,
      data: params,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      },
      responseType: "blob",
    })
      .then((res) => {
        const content = res.data;
        const blob = new Blob([content]);
        let rs_fileName = "";
        try {
          rs_fileName = res.headers["content-disposition"].split(";")[1].split("filename=")[1];
          rs_fileName = decodeURI(rs_fileName);
        } catch (e) {
          console.log(e);
        }

        if (rs_fileName) {
          fileName = rs_fileName;
        }

        let isEdge = navigator.userAgent.indexOf("Edge") > -1;
        if (isEdge) {
          window.navigator.msSaveBlob(blob, fileName);
          if (func && typeof func == "function") {
            func();
          }
          return;
        }

        if ("download" in document.createElement("a")) {
          // not ie
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href);
          document.body.removeChild(elink);
          if (func && typeof func == "function") {
            func();
          }
          return;
        }
        navigator.msSaveBlob(blob, fileName);
        if (func && typeof func == "function") {
          func();
        }
      })
      .catch(() => {
        if (reject && typeof reject == "function") {
          reject();
        }
      });
  };
}

export default HttpDownload;
