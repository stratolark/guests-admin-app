import axios from 'axios';

export async function getFileFromUrl(url: string, type?: string) {
  //   if (typeof window === 'undefined') return; // make sure we are in the browser
  try {
    const response = await axios({
      url: url,
      method: 'GET',
      //   headers: {
      //     'Access-Control-Allow-Origin': '*',
      //     'Access-Control-Allow-Methods': 'GET',
      //   },
      // mode: 'no-cors',
      // cache: 'default',
      responseType: 'blob',
    });
    console.log(response.data);

    // const blob = await response.blob();
    // const metadata = {
    //   type: type || 'image/jpeg',
    // };
    // const file = new File([blob], url, metadata);
    // console.log('getFileFromUrl', file);

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
