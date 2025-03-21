from vllm import LLM, SamplingParams

prompts = ["Hello, my name is"]
model_path = 'deepseek-ai/DeepSeek-R1-Distill-Llama-8B'

sampling_params = SamplingParams(temperature=0.8, top_p=0.95)
llm = LLM(model=model_path, download_dir="E:\.cache")

outputs = llm.generate(prompts, sampling_params)

for output in outputs:
    prompt = output.prompt
    generated_text = output.outputs[0].text
    print(f"Prompt: {prompt!r}, Generated text: {generated_text!r}")