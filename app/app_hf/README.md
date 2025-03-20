### Env

`conda create -n fastApi python=3.10`

`conda activate fastApi`

### Dependencies

`conda install -c conda-forge fastapi uvicorn transformers pytorch`

`pip install safetensors sentencepiece protobuf`

Check if pytorch w/ CUDA is installed. If not, use `pip` to install pytorch with CUDA.

### Running

`uvicorn main:app --reload --host 0.0.0.0`

### Testing

`http://localhost:8000/docs`