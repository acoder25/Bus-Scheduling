import csv
import random
import string
from faker import Faker

# Initialize Faker for generating random names and cities
fake = Faker()

# Function to generate a random bus code or an empty string
def generate_bus_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=5)) if random.choice([True, False]) else ''

# Number of records to generate
num_records = 100

# CSV file name
csv_file = "driver_details.csv"

# Create and write to the CSV file
with open(csv_file, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Driver ID", "Driver Name", "City", "Bus Assigned"])
    
    for _ in range(num_records):
        driver_id = random.randint(1000, 9999)
        driver_name = fake.name()
        city = fake.city()
        bus_assigned = generate_bus_code()
        
        writer.writerow([driver_id, driver_name, city, bus_assigned])

print(f"Generated {num_records} random driver details and saved to '{csv_file}'.")
