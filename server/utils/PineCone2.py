import os
from pinecone import Pinecone, ServerlessSpec
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from uuid import uuid4
from langchain_core.documents import Document
from pinecone.exceptions import PineconeApiException

class PineCone2:
    def __init__(self, index_name="index-1", dimension=1536):
        self.api_key = os.getenv("PINECONE_API_KEY")
        if not self.api_key:
            raise ValueError("PINECONE_API_KEY environment variable is required.")

        self.pc = Pinecone(api_key=self.api_key)
        self.index_name = index_name
        self.dimension = dimension

        existing_indexes = self.pc.list_indexes()
        if self.index_name not in existing_indexes:
            try:
                self.pc.create_index(
                    name=self.index_name,
                    dimension=self.dimension,
                    metric="cosine",
                    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
                )
            except PineconeApiException as e:
                if "ALREADY_EXISTS" in str(e):
                    pass
                else:
                    raise

        self.index = self.pc.Index(self.index_name)
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        self.vector_store = PineconeVectorStore(index=self.index, embedding=self.embeddings)


    def add2VectorStore(self):
        document_1 = Document(
            page_content="I had chocolate chip pancakes and scrambled eggs for breakfast this morning.",
            metadata={"source": "tweet"},
        )
        document_2 = Document(
            page_content="The weather forecast for tomorrow is cloudy and overcast, with a high of 62 degrees.",
            metadata={"source": "news"},
        )
        documents = [document_1, document_2]
        uuids = [str(uuid4()) for _ in range(len(documents))]
        self.vector_store.add_documents(documents=documents, ids=uuids)

    def retrieve_documents(self):
        results = self.vector_store.similarity_search("chocolate chip pancakes", k=1)
        return [
            {
                "content": doc.page_content,
                "metadata": doc.metadata
            }
            for doc in results
        ]



