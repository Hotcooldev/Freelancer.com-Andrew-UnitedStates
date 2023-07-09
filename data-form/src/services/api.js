import axios from "axios";

const VITE_API_KEY = import.meta.env.VITE_API_KEY;

const API_URL = `/stubs/handler_api.php?api_key=${VITE_API_KEY}`;

const STATUS_CODES = {
  SMS_SENT: 1,
  REQUEST_ANOTHER_SMS: 3,
  CONFIRM_SMS: 6,
  CANCEL_ACTIVATION: 8,
};

const OPERATOR = "any";

export async function getNumber(country, service) {
  try {
    await getCurrentActivations();
    const URL = `${API_URL}&action=getNumber&service=${service}&operator=${OPERATOR}&service=${service}&country=${country}`;
    const response = await axios.get(URL);
    console.log(response);
    console.log(response.data.split(":")[0]);

    if (response.data.split(":")[0] === "ACCESS_NUMBER") {
      const [_, id, number] = response.data.split(":");
      return [id, number];
    } else {
      return response.data;
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function getCode(id) {
  const responseSetStatus = await setStatus(STATUS_CODES.SMS_SENT, id);
  console.log(responseSetStatus);

  const responseGetCode = await getStatus(id);
  console.log(responseGetCode);
  if (responseGetCode.data.split(":")[0] === "STATUS_OK") {
    return responseGetCode.data.split(":")[1];
  } else {
    return responseGetCode.data;
  }
}

export async function verifyDone(id) {
  const responseSetStatus = await setStatus(STATUS_CODES.CONFIRM_SMS, id);
  console.log(responseSetStatus);
  return;
}

export async function getNewCode(id) {
  const responseSetStatus = await setStatus(
    STATUS_CODES.REQUEST_ANOTHER_SMS,
    id
  );
  console.log(responseSetStatus);

  const responseGetCode = await getStatus(id);
  console.log(responseGetCode);
  if (responseGetCode.data.split(":")[0] === "STATUS_OK") {
    return responseGetCode.data.split(":")[1];
  } else {
    return responseGetCode.data;
  }
}

export async function cancelService(id) {
  const responseSetStatus = await setStatus(STATUS_CODES.CANCEL_ACTIVATION, id);
  console.log(responseSetStatus);
}

async function getCurrentActivations() {
  try {
    const URL = `${API_URL}&action=getCurrentActivations`;
    const response = await axios.get(URL);
    console.log(response.data);
  } catch (error) {
    throw new Error(error);
  }
}

export async function getBalance() {
  try {
    const URL = `${API_URL}&action=getBalance`;
    const response = await axios.get(URL);
    console.log(response.data);

    const [_, balance] = response.data.split(":");
    console.log(balance);
    return balance;
  } catch (error) {
    throw new Error(error);
  }
}

/* 
The following actions are available immediately after receiving the number:
8 - Cancel activation
1 - Notify that SMS has been sent (optional)

To activation with status 1:
8 - Cancel activation

Immediately after receiving the code:
3 - Request another SMS
6 - Confirm SMS code and complete activation

To activation with status 3:
6 - Confirm SMS code and complete activation */

async function getStatus(id) {
  try {
    const URL = `${API_URL}&action=getStatus&id=${id}`;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

async function setStatus(statusCode, id) {
  try {
    const URL = `${API_URL}&action=setStatus&status=${statusCode}&id=${id}`;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getServices(country) {
  if (!country) {
    return null;
  }
  const URL = `${API_URL}&action=getPrices&country=${country}`;
  const response = await axios.get(URL);
  return response.data;
}
