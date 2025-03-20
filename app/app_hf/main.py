from fastapi import FastAPI
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = FastAPI()

# deepseek-ai/DeepSeek-R1-Distill-Llama-8B
model_path = 'deepseek-ai/DeepSeek-R1-Distill-Llama-8B'

tokenizer = AutoTokenizer.from_pretrained(model_path, cache_dir="E:\.cache")

device = "cuda" if torch.cuda.is_available() else "cpu"
print(device)
model = AutoModelForCausalLM.from_pretrained(model_path, cache_dir="E:\.cache").to(device)

@app.get("/generate")
async def generate_text(prompt: str):
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(inputs["input_ids"], max_length=1024)
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return {"generated_text": generated_text}