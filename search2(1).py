import networkx as nx
import osmnx as ox
import folium
from shapely.geometry import Point, LineString
import csv

from flask import Flask, render_template, send_file
import os

app = Flask(__name__)

def stops(file_path):
    places = []
    with open(file_path, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            places.append({
                'name': row['stop_name'],
                'lat': float(row['stop_lat']),
                'lon': float(row['stop_lon'])
            })
    return places

def search(name, file_path):
    places = []
    with open(file_path, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if name ==  row['stop_name'] :
                return (float(row['stop_lat']), float(row['stop_lon']))

def categorize_stops(start):
    lat, lon = start(0), start(1)
    if float(lat) >= 28.6 and float(lon) >= 77.2:
       return "NE"
    elif float(lat) >= 28.6 and float(lon) < 77.2:
        return "NW"
    elif float(lat) < 28.6 and float(lon) >= 77.2:
        return "SE"
    else:  # lat < 0 and lon < 0
        return "SW"

def driver(file_path, reg, id):
    with open(file_path, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['Bus Assigned'] == '' and row['Zone'] == reg:
                row['Bus Assigned'] = id  # id not generated yet 
        
def fetch_road_network(bbox):
    return ox.graph_from_bbox(bbox[1], bbox[3], bbox[0], bbox[2], network_type='drive')

def create_graph(road_data):
    return road_data

def calculate_route(G, origin, destination):
    origin_node = ox.nearest_nodes(G, origin[1], origin[0])
    destination_node = ox.nearest_nodes(G, destination[1], destination[0])
    route = nx.shortest_path(G, origin_node, destination_node, weight='length')
    total_distance = sum(ox.utils_graph.get_route_edge_attributes(G, route, 'length')) / 1000  # km
    return route, total_distance

def find_places_on_path(route, G, places_of_interest, tolerance=65):
    route_coords = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in route]
    route_line = LineString(route_coords)
    
    on_path_places = []
    for place in places_of_interest:
        point = Point(place['lon'], place['lat'])
        if route_line.distance(point) < tolerance:
            on_path_places.append({
                'name': place['name'],
                'lat': place['lat'],
                'lon': place['lon'],
                'distance': 0  
            })
    return on_path_places

def create_map(route, G, origin, destination, on_path_places, bbox):
    center = [(bbox[1] + bbox[3]) / 2, (bbox[0] + bbox[2]) / 2]
    route_coords = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in route]
    m = folium.Map(location=center, zoom_start=11)
    
    # Plot the route
    folium.PolyLine(route_coords, color="blue", weight=2, opacity=0.8).add_to(m)
    
    # Mark origin and destination
    folium.Marker(origin, popup='Origin').add_to(m)
    folium.Marker(destination, popup='Destination').add_to(m)

    folium.Rectangle(bounds=[(bbox[1], bbox[0]), (bbox[3], bbox[2])], 
                         color="red", fill=False, weight=1).add_to(m)
    
    # Mark on-path places
    for place in on_path_places:
        folium.Marker(
            [place['lat'], place['lon']],
            popup=place['name'],
            icon=folium.Icon(color='green', icon='info-sign')
        ).add_to(m)
    
    return m

def main():
    bbox = (77.0, 28.4, 77.4, 28.8)  # Delhi area

    # origin = search(start, "C:/Users/aakas/Downloads/GTFS/stops - Copy (3).csv") # Delhi
    # destination = search(end, "C:/Users/aakas/Downloads/GTFS/stops - Copy (3).csv")# Delhi (different point)

    origin = (28.74245,77.246567)
    destination = (28.528867,77.08675)

    places_of_interest = stops(r"C:\Users\ashit\Desktop\SIH\stops - Copy (3).csv")
    
    print("Fetching road network data...")
    road_data = fetch_road_network(bbox)
    
    print("Creating graph...")
    G = create_graph(road_data)
    
    print("Calculating optimal route...")
    route, total_distance = calculate_route(G, origin, destination)
    
    if route is None:
        print("No valid route found.")
        return
    
    print(f"Optimal Route Found:")
    print(f"Total Distance: {total_distance:.2f} km")
    
    print("Finding places on the path...")
    on_path_places = find_places_on_path(route, G, places_of_interest)
    
    print(f"Places of Interest on the Path:")
    for place in on_path_places:
        print(f"- {place['name']}")
    
    print("Creating map...")
    m = create_map(route, G, origin, destination, on_path_places, bbox)
    m.save("templates/search.html")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/map')
def display_map():
    return render_template('search.html')


if __name__ == "__main__":
    main()
    app.run()