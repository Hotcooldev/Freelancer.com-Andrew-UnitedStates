import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

import { FormControl, FormLabel, Stack } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import FormSelect from "react-bootstrap/FormSelect";

import "./App.css";
import { COUNTRIES_DATA } from "./countries";
import { AVAILABLE_SERVICES } from "./services";
import {
  cancelService,
  getBalance,
  getCode,
  getNewCode,
  getNumber,
  getServices,
  verifyDone,
} from "./services/api";

function App() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numberId, setNumberId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [availableServices, setAvailableServices] = useState(null);
  const [balance, setBalance] = useState("");

  const buyNumber = async () => {
    const [id, number] = await getNumber(selectedCountry, selectedService);
    if (number) {
      setPhoneNumber(number);
      setNumberId(id);
    }
  };

  const handleGetBalance = async () => {
    const newBalance = await getBalance();
    if (newBalance) {
      setBalance(newBalance);
    }
  };

  const getVerificationCode = async () => {
    const code = await getCode(numberId);

    if (code) {
      setVerificationCode(code);
    }
  };

  const handleDone = () => {
    resetStates();
    verifyDone(numberId);
  };

  const handleResend = async () => {
    const code = await getNewCode(numberId);

    if (code) {
      setVerificationCode(code);
    }
  };

  const handleCancel = async () => {
    resetStates();
    cancelService(numberId);
  };

  const resetStates = () => {
    setSelectedCountry("");
    setSelectedService("");
    setPhoneNumber("");
    setNumberId("");
    setBalance("");
    setVerificationCode("");
    setAvailableServices(null);
  };

  useEffect(() => {
    console.log(selectedCountry, selectedService, phoneNumber, numberId);
  });

  useEffect(() => {
    async function fetchServices() {
      const data = await getServices(selectedCountry);
      if (data) {
        setAvailableServices(Object.keys(data[selectedCountry]));
      }
    }
    fetchServices();
  }, [selectedCountry]);

  return (
    <>
      <div className="container">
        <FormLabel htmlFor="country-selector">Country:</FormLabel>
        <FormSelect
          id="country-selector"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option>Select a country</option>
          {COUNTRIES_DATA.map((country) => (
            <option value={country.id} key={country.id}>
              {country.name.slice(0, 1).toLocaleUpperCase() +
                country.name.slice(1)}
            </option>
          ))}
        </FormSelect>
        <br />
        <FormLabel htmlFor="service-selector">Service:</FormLabel>
        <FormSelect
          id="service-selector"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option>Select a Service</option>
          {availableServices?.map((serviceId) => (
            <option value={serviceId} key={serviceId}>
              {AVAILABLE_SERVICES[serviceId]}
            </option>
          ))}
        </FormSelect>
        <br />
        <Stack direction="horizontal" gap={3}>
          <Button
            onClick={buyNumber}
            variant="primary"
            disabled={!selectedCountry && !selectedService}
          >
            Get Number
          </Button>
          <Button onClick={handleGetBalance} variant="primary">
            Get balance
          </Button>
          <span>Balance: {balance}</span>
        </Stack>
        <br />
        <br />
        <FormLabel htmlFor="phone-number">Phone Number:</FormLabel>
        <FormControl
          type="phoneNumber"
          id="phone-number"
          value={phoneNumber}
          disabled
        />
        <br />
        <Button
          variant="primary"
          disabled={phoneNumber.length < 10}
          onClick={getVerificationCode}
        >
          Send Verification Code
        </Button>
        <br />
        <br />
        <FormLabel htmlFor="verification-code">Verification Code:</FormLabel>
        <FormControl
          type="default"
          id="verification-code"
          disabled
          value={verificationCode}
        />
        <br />
        <Stack direction="horizontal" gap={3}>
          <Button
            variant="primary"
            disabled={phoneNumber.length < 10}
            onClick={handleDone}
          >
            Done
          </Button>
          <Button
            variant="primary"
            disabled={phoneNumber.length < 10}
            onClick={handleResend}
          >
            Get Another Code
          </Button>
          <Button
            variant="primary"
            disabled={phoneNumber.length < 10}
            onClick={handleCancel}
          >
            Cancel Verification
          </Button>
        </Stack>
      </div>
    </>
  );
}

export default App;
