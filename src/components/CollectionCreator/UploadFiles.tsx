import React, {useState, useEffect, Dispatch} from 'react'
import { StepperFormProps } from '../../model/types';
import apiClient from '../../utils/apiClient';
import { CONFIG } from '../../utils/config';
import { LinearProgress } from '@mui/material';

const UploadFiles: React.FC<StepperFormProps> = ({
  nextStep,
  handleInputData,
  data
}) => {
  const [error, setError] = useState(false);
  const [CoverImage, setCoverImage] = useState<File>();
  const [CoverUploadSuccess, setCoverUploadSuccess] = useState<boolean>();
  const [ImageData, setImageData] = useState<File>();
  const [ImageDataProgress, setImageDataProgress] = useState<number>(0);
  const [showLoader, setShowLoader] = useState<boolean>();
  const [ImageDataUploadSuccess, setImageDataUploadSuccess] = useState<boolean>();
  const [ImageUrl, setImageUrl] = useState<string>();

  const localenv = CONFIG.DEV

  useEffect(() => {
    if (CoverImage) {
      setImageUrl(URL.createObjectURL(CoverImage));
    }
  }, [CoverImage]);

  // after form submit validating the form data using validator
  const submitFormData = (e: any) => {
    e.preventDefault();
 
    if (
      !ImageDataUploadSuccess ||
      !CoverUploadSuccess
    ) {
      setError(true);
      alert("Something went wrong!");
    } else {
      nextStep();
    }
  };

const uploadCoverImage = async (file: File) => {
  setCoverImage(file);
  
  const formdata = new FormData();
  formdata.append("cover", file)
  
  apiClient.post(
    localenv.api.paths.uploadImageCover,
    formdata,
    {
      "headers": {"Content-Type": "form-data"},
      "params": {"collection": data.name},
    }
    )
    .then(function(response) {
    console.log("Cover image " + file.name + " for collection " + data.name + " uploaded successfully" )
    handleInputData("coverImage", file);
    setCoverUploadSuccess(true);
    }).catch(function(error){
    console.log("Error uploading cover image")
    setCoverUploadSuccess(false);
    });
}

const uploadImageData = async (file: File) => {
  setImageData(file);
  const formdata = new FormData();
  formdata.append("images", file)
  setShowLoader(true)
  
  triggerUpload(formdata, (progressEvent: any) => {
    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    console.log(progress);
    setImageDataProgress(progress);
  });

  // .then(function(response: any) {
  //   console.log(response)
  //   setImageDataProgress(response);
  //   console.log("image data progress " + ImageDataProgress);
  //   setImageDataUploadSuccess(true);
  //   setShowLoader(false);
  //   })
  // .catch(function(error: any){
  //   console.log("Error uploading collection image")
  //   setImageDataUploadSuccess(false);
  //   });
}


useEffect(() => {
  console.log("image data prog " + ImageDataProgress)

}, [ImageDataProgress, setImageDataProgress])

const triggerUpload = (
  formdata: FormData,
  onImageDataProgress: any) => {
  return apiClient.post(
    localenv.api.paths.uploadImageData,
    formdata,
    {
      "headers": {"Content-Type": "form-data"},
      "params": {"collection": data.name},
      "onUploadProgress": onImageDataProgress
      // (progressEvent) => {
        // const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        // console.log("initial: " + progress)
        // onImageDataProgress(progress)
        
      },
    );
  }

  return (
    <div className="w-full md:w-2/5 md:text-left flex flex-col items-center">
          <div className="flex flex-col items-center order-1 w-fit">
              <input
                  type="file"
                  name="CoverImage"
                  accept="image/png, image/gif, image/jpeg"
                  id="CoverImageField"
                  style={{'display': 'none'}}
                  onChange={(event) => uploadCoverImage(event.target.files![0])}
              />
              <label htmlFor="CoverImageField">
              { ImageUrl && CoverImage ? 
              <div className="w-[350px] lg:w-[400px] aspect-square">
                  <img className="w-full rounded-2xl aspect-square object-cover" src={ImageUrl}/>
              </div>
              : 
              <div className="w-[350px] lg:w-[400px] aspect-square rounded-2xl text-center flex flex-col items-center bg-[#33313d]">
                  <svg className="inline-block mt-[35%] mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="inline-block align-middle order-3 px-5 py-2 rounded-2xl text-sm disabled:cursor-not-allowed">Upload a cover image</span>
              </div>
              }
              </label>
          </div>
          <div className="w-full order-2 my-10">
              <input
                  type="file"
                  name="ImageData"
                  accept=".zip"
                  id="ImageDataField"
                  style={{'display': 'none'}}
                  onChange={(event) => uploadImageData(event.target.files![0])}
              />
              <label htmlFor="ImageDataField">
              { ImageData ? 
              <div className="w-full h-[200px] rounded-2xl text-center flex flex-col items-center border-dotted border-2 border-zinc-100/100">
                  <p className="text-center mt-20">{ImageData.name}</p>
              </div>
              : 
              <div className="w-full h-[200px] rounded-2xl border-2 border-zinc-100/100 flex flex-col items-center ">
                  <span className="text-center mt-20">Upload a zip file</span>
                  <div className="w-4/5">
                    <LinearProgress id="progress-loader" variant="determinate" value={ImageDataProgress!}/>
                  </div>
              </div>
              }
              </label>
            </div>
          <div className="text-center order-3">
            {(ImageDataUploadSuccess && CoverUploadSuccess) ? <button className="bg-gradient-to-r from-fuchsia-500 to-blue-500 p-3 rounded-3xl w-2/5 min-w-[100px]" onClick={submitFormData}>Next</button> : <button className="bg-zinc-500 p-3 rounded-3xl w-2/5 min-w-[100px]" onClick={nextStep}>Next</button>}
          </div>
      </div>
  );
}

export default UploadFiles
