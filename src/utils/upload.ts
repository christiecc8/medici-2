import apiClient from './apiClient'
import { API_PATHS, CONFIG } from './config'
import JSZip from 'jszip';

const localenv = CONFIG.DEV

/* -------------------------------------------------------------------------- */
/*                              Image Data Upload                             */
/* -------------------------------------------------------------------------- */

export const triggerUploadImageData = async (
  name: string,
  formdata: FormData,
  onImageDataProgress: any) => {
    console.log("Uploading image file " + formdata.get("images"))
  return apiClient.post(
    localenv.api.paths.uploadImageData,
    formdata,
    {
      "headers": {"Content-Type": "form-data"},
      "params": {"collection": name},
      "onUploadProgress": onImageDataProgress
    },
    ).then((response) => {
      console.log(response)
      return Promise.resolve(true);
    }).catch((error) => {
      console.log(error);
      return Promise.reject(false);
  })
}

export const triggerUploadMusicData= async (
  name: string,
  formdata: FormData,
  onImageDataProgress: any) => {
  console.log("Uploading music file " + formdata.get("files"))
  return apiClient.post(
    API_PATHS.UPLOAD_MUSIC_DATA,
    formdata,
    {
      "headers": {"Content-Type": "form-data"},
      "params": {"collection": name},
      "onUploadProgress": onImageDataProgress
    },
    ).then((response) => {
      return Promise.resolve(true);
    }).catch((error) => {
      console.log(error);
      return Promise.reject(false);
  })
}

export const createProject = async (name: string, walletAddress: string) => {
  const request_data = {
    "collection": name,
    "masterAddress": walletAddress
  }
  console.log("Creating project " + name + " for address " + walletAddress)

  return apiClient.post(
    API_PATHS.CREATE_PROJECT,
    request_data,
    {
      "headers": {"Content-Type": "application/json"},
    })
    .then(function(response) {
      return Promise.resolve(true);
    }).catch(function(error){
      return Promise.resolve(false);
    });
}

/* -------------------------------------------------------------------------- */
/*                               Metadata Upload                              */
/* -------------------------------------------------------------------------- */

export const triggerUploadMetadata = async (
name: string,
formdata: FormData,
onMetadataProgress: any) => {
  return apiClient.post(
    localenv.api.paths.uploadMetadata,
    formdata,
    {
    "headers": {"Content-Type": "form-data"},
    "params": {"collection": name},
    "onUploadProgress": onMetadataProgress
    },
    ).then((response) => {
    console.log(response);
    return Promise.resolve("ok");
    }).catch((error) => {
    return Promise.reject("error");
  })
}

/* -------------------------------------------------------------------------- */
/*                                Upload Cover                                */
/* -------------------------------------------------------------------------- */

export const uploadCoverImage = async (name: string, symbol: string, file: File) => {
  const formdata = new FormData();
  formdata.append("cover", file)

  return apiClient.post(
    localenv.api.paths.uploadImageCover,
    formdata,
    {
      "headers": {"Content-Type": "form-data"},
      "params": {"collection": name, "symbol": symbol},
    })
    .then(function(response) {
      console.log(response)
      return Promise.resolve(true);
    }).catch(function(error){
      console.log(error)
      return Promise.resolve(false);
    });
}

export const getUploadPreview = async (name: string) => {
  console.log("Getting previews for collection " + name)

  return apiClient.get(
    API_PATHS.GET_UPLOAD_PREVIEW,
    {
    "headers": {"Content-Type": "application/json"},
    "params": {"collection": name},
    },
    ).then((response) => {
    console.log(response);
    const res = {
      baseURI: response.data.baseURI,
      totalSupply: response.data.totalSupply,
      randomFileURL: response.data.randomFileURL,
      randomMetadataURL: response.data.randomMetadataURL,
      status: response.data.status
    }
    return Promise.resolve(res);
    }).catch((error) => {
    console.log(error)
    return Promise.reject("error");
  })
}

export const createZip = async (files: FileList) => {
  const zip = new JSZip();
  const zipFolder = zip.folder("folder")

  for (let i = 0; i < files.length; i++) {
    zipFolder!.file(files[i].name, files[i])
  }
  console.log(zip)
  return zipFolder!.generateAsync({ type: 'blob' });
}