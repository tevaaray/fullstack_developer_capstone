from flask import Flask, jsonify, request
import os
import json
from datetime import datetime

app = Flask(__name__)
DATA_FILE = 'courses.json'

def load_courses():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading data file: {e}")
        return []

def save_courses(courses):
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(courses, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error writing data file: {e}")

def get_next_id(courses):
    if not courses:
        return 1
    return max(course['id'] for course in courses) + 1

@app.route('/api/courses', methods=['GET'])
def get_courses():
    courses = load_courses()
    search_query = request.args.get('q', '').lower()
    if search_query:
        filtered = [
            c for c in courses 
            if search_query in c['name'].lower() or search_query in c['description'].lower()
        ]
        return jsonify(filtered), 200
    return jsonify(courses), 200

@app.route('/api/courses/stats', methods=['GET'])
def get_stats():
    courses = load_courses()
    stats = {
        "total": len(courses),
        "notStarted": sum(1 for c in courses if c['status'] == 'Not Started'),
        "inProgress": sum(1 for c in courses if c['status'] == 'In Progress'),
        "completed": sum(1 for c in courses if c['status'] == 'Completed')
    }
    return jsonify(stats), 200

@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    courses = load_courses()
    course = next((c for c in courses if c['id'] == course_id), None)
    if not course:
        return jsonify({"error": "Course not found"}), 404
    return jsonify(course), 200

@app.route('/api/courses', methods=['POST'])
def add_course():
    data = request.get_json()
    if not data or not all(k in data for k in ('name', 'description', 'target_date')):
        return jsonify({"error": "Missing required fields"}), 400
    courses = load_courses()
    new_course = {
        "id": get_next_id(courses),
        "name": data['name'],
        "description": data['description'],
        "target_date": data['target_date'],
        "status": data.get('status', 'Not Started'),
        "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    courses.append(new_course)
    save_courses(courses)
    return jsonify(new_course), 201

@app.route('/api/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    courses = load_courses()
    course = next((c for c in courses if c['id'] == course_id), None)
    if not course:
        return jsonify({"error": "Course not found"}), 404
    data = request.get_json()
    course['name'] = data.get('name', course['name'])
    course['description'] = data.get('description', course['description'])
    course['target_date'] = data.get('target_date', course['target_date'])
    course['status'] = data.get('status', course['status'])
    save_courses(courses)
    return jsonify(course), 200

@app.route('/api/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    courses = load_courses()
    updated_courses = [c for c in courses if c['id'] != course_id]
    if len(updated_courses) == len(courses):
        return jsonify({"error": "Course not found"}), 404
    save_courses(updated_courses)
    return jsonify({"message": "Course deleted successfully", "id": course_id}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
