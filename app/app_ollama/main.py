from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import ollama
import re

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model_name = "r1"

instruct_prompt = R"""
    You will be given a competitive programming problem. Please reason step by step about the solution, then provide a complete implementation in C++17.

    If starter code is provided below, fill in the starter code; 
    otherwise, create a Solution class and fill it in. Your solution must be a function that takes the input as arguments, and returns the answer.

    Put your final solution within a single code block:
    ```cpp
    <your code here>
    ```
    Only output the final solution code, don't output any explanation.
    # Problem
    {}

    # Starter Code
    {}
    """


def extract_code(text: str) -> str:
    """
    Extracts and returns the code within the first triple-backtick block in the given text.
    It removes the optional language specifier (e.g., 'cpp', 'python', etc.) if present.

    Parameters:
        text (str): The string containing the code block wrapped in triple backticks.

    Returns:
        str: The code inside the triple backticks, or an empty string if no code block is found.
    """
    # This regex pattern:
    # - Matches three backticks.
    # - Optionally matches any non-newline characters (the language tag) until a newline.
    # - Captures everything until the closing three backticks.
    pattern = r"```[^\n]*\n(.*?)```"

    match = re.search(pattern, text, re.DOTALL)
    if match:
        return match.group(1).rstrip()  # remove any trailing whitespace
    return ""


@app.get("/generate")
async def generate_sol(statement: str, starter_code: str):
    resp = ollama.generate(
        model=model_name,
        prompt=instruct_prompt.format(statement, starter_code),
        options={"num_ctx": 32768},
        stream=True,
    )
    s = ""
    for chunk in resp:
        print(chunk.response, end="", flush=True)
        s += chunk.response
    return extract_code(s)
