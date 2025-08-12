# import pinecone
# from dotenv import load_dotenv
# import os
# from pinecone import Pinecone, ServerlessSpec

# load_dotenv()  # Load environment variables from .env file

# class PineconeStore:
#     def __init__(self, environment="us-east-1"):
#         # Load API key from environment variables
#         pinecone_api_key = os.getenv("PINECONE_API_KEY")
#         if not pinecone_api_key:
#             raise ValueError("PINECONE_API_KEY environment variable not set")

#         # Create a Pinecone instance
#         self.pc = Pinecone(api_key=pinecone_api_key)

#         # Define the index name
#         self.index_name = "pdf-vector-store"

#         # Check if the index exists, if not create it
#         if self.index_name not in self.pc.list_indexes().names():
#             self.pc.create_index(
#                 name=self.index_name,
#                 dimension=1536,
#                 metric='cosine',
#                 spec=ServerlessSpec(cloud='aws', region='us-east-1')
#             )

#     def save_vectors(self, vectors, metadata, chunks):
#         # Get the index
#         index = self.pc.Index(self.index_name)

#         # Iterate over the embeddings and save each one with unique metadata
#         for i, vector in enumerate(vectors):
#             vector_id = f"{metadata['id']}_chunk_{i}"  # Unique ID for each chunk
#             chunk_metadata = {
#                 "id": vector_id,
#                 "source": metadata["source"],
#                 "chunk": i,
#                 "text": chunks[i]  # Add the text of the chunk here
#             }
#             # Upsert each vector with its corresponding metadata
#             index.upsert(vectors=[(vector_id, vector, chunk_metadata)])
