# **Cartesi Super Soccer**  

## **Why the Coprocessor?**  

With the coprocessor, we can upgrade players' attributes quickly without needing vouchers.  

The end user will purchase a pack of 8 soccer players (ERC-721).  
Each player will start at a pseudo-random level.  
If you're a hacker, you can choose your player's name and get a better starting level.  

The match leverages [Drand](https://drand.love/), utilizing knowledge from another project.  

At the end of the match, for an AI LLM use case, we compiled the [Ollama](https://ollama.com/) command line for **riscv64**.  
It was a crazy journey! To achieve this compilation, we fixed numerous bugs related to CPU-only mode,  
running it inside the Cartesi Machine with a **backdoor** to explore and debug errors that only occurred within the CM.  
Ollama is a great convenience tool, as you can easily choose from a variety of LLM models.
For our case, we chose [SmolLM](https://huggingface.co/blog/smollm) to run it quickly inside the CM.
