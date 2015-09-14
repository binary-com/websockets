(ns binaryws.core
  (:require [gniazdo.core :as ws]) ;; [stylefruits/gniazdo "0.4.0"]
  (:gen-class))
(defn -main
  [& args]
  (def socket
   (ws/connect
    "wss://www.binary.com/websockets/v2"
    :on-receive #(prn 'received %)))
  (ws/send-msg socket "{ \"ticks\": \"R_100\"}")
  (Thread/sleep 5000)
  (ws/close socket)
)
