#include <Wire.h>
#include <DHT.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "vphuongg";
const char* password = "phuong071";


const int DHTPIN = 32;       
const int DHTTYPE = DHT11;  
const int soilMoisturePin = 33; 

// const int buttonPin = 34;
const int relayPin = 4;

int relay1State = HIGH;
int lastRelay1State = HIGH;
// int pushButton1State = HIGH;

float lastTemperature = -999; 
float lastHumidity = -999;    
float lastSoilMoisture = -999; 


DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  dht.begin(); // Khởi động cảm biến DHT11
  Wire.begin();

  // pinMode(buttonPin, INPUT);
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, relay1State );
}

void loop() {
  lcd.init();
  lcd.backlight();
  lcd.clear();

  float humidity = dht.readHumidity();             // Đọc độ ẩm
  float temperature = dht.readTemperature();       // Đọc nhiệt độ
  float soilMoisture = soilMoisturePercent(analogRead(soilMoisturePin));  // Đọc số analog của độ ẩm đất


  printSerial(temperature, humidity, soilMoisture);

  printLCD(temperature, humidity, soilMoisture);

    if (temperature != lastTemperature || humidity != lastHumidity || soilMoisture != lastSoilMoisture) {
    // Nếu có sự thay đổi về nhiệt độ, độ ẩm hoặc độ ẩm đất, gửi dữ liệu lên server
    postData(temperature, humidity, soilMoisture);

    // Cập nhật giá trị trước đó cho lần so sánh tiếp theo
    lastTemperature = temperature;
    lastHumidity = humidity;
    lastSoilMoisture = soilMoisture;
  }
  checkButton();
  delay(1000);
}


float soilMoisturePercent(int analogValue) {
  float value = map(analogValue, 0, 4095, 0, 100);
  value = (value - 100) * -1;
  return value;
}

void postData(float temperature, float humidity, float soilMoisture) {
  if(WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin("http://172.20.10.9:5000/sensor-data");
      http.addHeader("Content-Type", "application/json");
        // Tạo chuỗi JSON để gửi lên server
      const size_t capacity = JSON_OBJECT_SIZE(3);
      DynamicJsonDocument doc(capacity);

      // Thêm dữ liệu vào đối tượng JSON
      doc["temperature"] = temperature;
      doc["humidity"] = humidity;
      doc["soilMoisture"] = soilMoisture;

      String jsonString;
      serializeJson(doc, jsonString);

      int httpResponseCode = http.POST(jsonString);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(response);
      } else {
        Serial.println("Error on sending POST request");
        Serial.println(httpResponseCode);
        Serial.println(http.errorToString(httpResponseCode).c_str());
      }
      http.end();
    } else {
      Serial.println("Error! Not connected to WiFi");
    }
}

void checkButton() {
    if(WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin("http://172.20.10.9:5000/toggle");
        int httpResponseCode = http.GET();

        if (httpResponseCode > 0) {
            String response = http.getString();

            // Phân tích dữ liệu JSON để lấy giá trị của isOn
            DynamicJsonDocument doc(1024);
            deserializeJson(doc, response);

            // Lấy giá trị của isOn từ JSON
            bool isOn = doc[0]["isOn"];

            // Kiểm tra giá trị của isOn và cập nhật relay1State
            if (isOn) {
                relay1State = LOW;
            } else {
                relay1State = HIGH;
            }

            // Điều khiển relay1 theo giá trị mới
            digitalWrite(relayPin, relay1State);
        } else {
            Serial.println("Error on receiving GET request");
        }
        http.end();
    } else {
        Serial.println("Error! Not connected to WiFi");
    }
}


void printSerial(float temperature, float humidity, float soilMoisture) {
  Serial.print("T: ");
  Serial.print(temperature);  //Xuất nhiệt độ
  Serial.println(" C");

  Serial.print("H: ");
  Serial.print(humidity);  //Xuất độ ẩm
  Serial.println("%");

  Serial.print("S: ");
  Serial.print(soilMoisture);
  Serial.println("%");
}

void printLCD(float temperature, float humidity, float soilMoisture) {
  lcd.setCursor(0, 0);
  lcd.print(temperature);
  lcd.print("C");

  lcd.setCursor(8, 0);
  lcd.print(humidity);
  lcd.print("%");

  lcd.setCursor(0, 1);
  lcd.print(soilMoisture);
  lcd.print("%");
}


// void checkPhysicalButton()
// {
//   if (digitalRead(buttonPin) == LOW) {
//     // pushButton1State is used to avoid sequential toggles
//     if (pushButton1State != LOW) {

//       // Toggle Relay state
//       relay1State = !relay1State;
//       digitalWrite(relayPin, relay1State);

//     }
//     pushButton1State = LOW;
//   } else {
//     pushButton1State = HIGH;
//   }
// }