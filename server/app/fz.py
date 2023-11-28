import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

def fuzzy(temp, humidity, soil):
    # Định nghĩa các biến đầu vào và đầu ra
    temperature = ctrl.Antecedent(np.arange(0, 101, 1), 'temperature')
    humidity = ctrl.Antecedent(np.arange(0, 101, 1), 'humidity')
    soil_moisture = ctrl.Antecedent(np.arange(0, 101, 1), 'soil_moisture')
    water_needed = ctrl.Consequent(np.arange(0, 101, 1), 'water_needed')

    # Định nghĩa các hàm thuộc tính (membership functions) cho biến đầu vào và đầu ra
    temperature['low'] = fuzz.trimf(temperature.universe, [0, 25, 50])
    temperature['medium'] = fuzz.trimf(temperature.universe, [25, 50, 75])
    temperature['high'] = fuzz.trimf(temperature.universe, [50, 75, 100])

    humidity['low'] = fuzz.trimf(humidity.universe, [0, 30, 60])
    humidity['medium'] = fuzz.trimf(humidity.universe, [30, 60, 90])
    humidity['high'] = fuzz.trimf(humidity.universe, [60, 90, 100])

    soil_moisture['dry'] = fuzz.trimf(soil_moisture.universe, [0, 30, 60])
    soil_moisture['moist'] = fuzz.trimf(soil_moisture.universe, [30, 60, 100])

    water_needed['low'] = fuzz.trimf(water_needed.universe, [0, 30, 60])
    water_needed['high'] = fuzz.trimf(water_needed.universe, [40, 70, 100])

    # Xác định các quy tắc suy luận
    rule1 = ctrl.Rule(temperature['high'] & humidity['high'] & soil_moisture['dry'], water_needed['high'])
    rule2 = ctrl.Rule(temperature['low'] & soil_moisture['moist'], water_needed['low'])
    rule3 = ctrl.Rule(humidity['low'] | soil_moisture['dry'], water_needed['high'])

    # Tạo hệ thống suy luận
    water_ctrl = ctrl.ControlSystem([rule1, rule2, rule3])
    watering = ctrl.ControlSystemSimulation(water_ctrl)

    # Gán giá trị cho các biến đầu vào
    watering.input['temperature'] = temp  # Độ nhiệt độ
    watering.input['humidity'] = humidity   # Độ ẩm
    watering.input['soil_moisture'] = soil # Độ ẩm đất

    # Tiến hành suy luận và dự đoán
    watering.compute()

    return watering.output['water_needed']
