from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key="pcsk_2nrRFt_8WdW7tZ2zLLgHebtRzpkmVGF5ogmeaMjwhWhaxQkT7uaMWZSSkBg6VvsoRtRs9m")

index_name = "developer-quickstart-py"

if not pc.has_index(index_name):
    pc.create_index_for_model(
        name=index_name,
        cloud="aws",
        region="us-east-1",
        embed={
            "model":"llama-text-embed-v2",
            "field_map":{"text": "chunk_text"}
        }
    )

index = pc.Index(index_name)

query = "Famous historical structures and monuments"

results = index.search(
    namespace="ns1",
    query={
        "top_k": 5,
        "inputs": {
            'text': query
        }
    }
)

print(results)