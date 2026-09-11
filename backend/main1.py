from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client
from dotenv import load_dotenv
import os


# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


# Connect to Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# Create FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Pydantic model
# -----------------------------

class Student(BaseModel):
    id: int
    name: str
    course: str
    marks: int


# -----------------------------
# GET - All students
# -----------------------------

@app.get("/students")
def get_students():

    response = supabase.table("students").select("*").execute()

    return response.data


# -----------------------------
# GET - One student
# -----------------------------

@app.get("/students/{student_id}")
def get_student(student_id: int):

    response = (
        supabase
        .table("students")
        .select("*")
        .eq("id", student_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return response.data[0]


# -----------------------------
# POST - Add student
# -----------------------------

@app.post("/students")
def add_student(student: Student):

    response = (
        supabase
        .table("students")
        .insert({
            "id": student.id,
            "name": student.name,
            "course": student.course,
            "marks": student.marks
        })
        .execute()
    )

    return response.data[0]


# -----------------------------
# PUT - Update student
# -----------------------------

@app.put("/students/{student_id}")
def update_student(student_id: int, student: Student):

    response = (
        supabase
        .table("students")
        .update({
            "name": student.name,
            "course": student.course,
            "marks": student.marks
        })
        .eq("id", student_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return response.data[0]


# -----------------------------
# DELETE - Delete student
# -----------------------------

@app.delete("/students/{student_id}")
def delete_student(student_id: int):

    response = (
        supabase
        .table("students")
        .delete()
        .eq("id", student_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "message": "Student deleted successfully",
        "student": response.data[0]
    }


# -----------------------------
# Run server
# -----------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main1:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )