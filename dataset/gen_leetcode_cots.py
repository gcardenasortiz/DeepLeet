import datasets
from openai import OpenAI
from tqdm import tqdm

client = OpenAI(
    api_key="",
    base_url="https://api.deepseek.com",
)

leetcode = datasets.load_dataset("greengerong/leetcode")["train"]


def get_cot(item):
    while True:
        try:
            instruct_prompt = R"""
            You will be given a competitive programming problem. Please reason step by step about the solution, then provide a complete implementation in C++17.

            If starter code is provided below, fill in the starter code; 
            otherwise, create a Solution class and fill it in. Your solution must be a function that takes the input as arguments, and returns the answer.

            Put your final solution within a single code block:
            ```cpp
            <your code here>
            ```
            Only output the final solution code.
            # Problem
            """
            print("getting", item["title"])
            statement = item["content"]
            prompt = instruct_prompt + "\n" + statement
            messages = [{"role": "user", "content": prompt}]
            resp = client.chat.completions.create(
                model="deepseek-reasoner",
                messages=messages,
                max_tokens=8192,
            )
            cot, code = (
                resp.choices[0].message.reasoning_content,
                resp.choices[0].message.content,
            )
            generation = "<think>\n" + cot + "\n</think\n\n" + code
            messages.append({"role": "assistant", "content": generation})
            out = {}
            out["description"] = statement
            out["id"] = item["id"]
            out["slug"] = item["slug"]
            out["title"] = item["title"]
            out["messages"] = messages
            out["prompt"] = prompt
            out["generation"] = generation
            print("sol length: ", len(code))
            return out
        except Exception as e:
            print("retrying", e)


nums = {"Easy": 15, "Medium": 35, "Hard": 50}

diff_inds = {"Easy": [], "Medium": [], "Hard": []}

for i, item in enumerate(leetcode):
    diff = item["difficulty"]
    if diff == None:
        # This happens for some problems for some reason :monkey:
        diff = "Medium"
    diff_inds[diff].append(i)


leetcode_cot = {}

import random

random.seed(42069)
for diff, inds in diff_inds.items():
    inds = random.sample(inds, nums[diff])
    print("run", diff)
    for i in tqdm(inds):
        out = get_cot(leetcode[i])
        for k, v in out.items():
            if not k in leetcode_cot:
                leetcode_cot[k] = []
            leetcode_cot[k].append(v)

leetcode_cot = datasets.Dataset.from_dict(leetcode_cot)

dick = datasets.DatasetDict({"train": leetcode_cot})
dick.save_to_disk("leetcode_cot")
