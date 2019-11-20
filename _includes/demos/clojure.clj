(ns binaryws.core
   (:require [gniazdo.core :as ws]) ;; [stylefruits/gniazdo "0.4.0"]
   (:require [cheshire.core :refer :all]) ;; [cheshire "5.5.0"]
  (:gen-class))
(defn -main
  [& args]
  (def socket
   (ws/connect
    "wss://ws.binaryws.com/websockets/v3?app_id=1089"
    :on-receive #(prn (parse-string %))))
  (ws/send-msg socket (generate-string {:ticks "R_100"}))
  (Thread/sleep 5000)
  (ws/close socket)
)
