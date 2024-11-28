
import { useEffect } from "react";
import { messaging } from "./firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";

const useNotifications = () => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const token = await getToken(messaging, { vapidKey: "BHyHOkWYAfnWKw60izTCs3r_CTn8Ki6WkS6skGP0ZOlrg7w61O8uQI3uT2uv97Ni6ssSpH6421lSeyTzrAdTl_o" });
        if (token) {
          console.log("Notification token:", token);
        } else {
          console.log("No registration token available.");
        }
      } catch (error) {
        console.error("Error getting notification token:", error);
      }
    };

    const handleForegroundMessage = () => {
      onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);
      });
    };

    requestPermission();
    handleForegroundMessage();
  }, []);
};

export default useNotifications;
