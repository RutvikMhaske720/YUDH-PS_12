"""
Specialist AI Agent - Entrypoint & Runner
Starts the web application server or runs CLI interactive reasoning mode.
"""
import sys
import os
import argparse
from dotenv import load_dotenv

load_dotenv()

def run_server(host=None, port=None):
    """Launch the FastAPI / Uvicorn web server."""
    if host is None:
        host = os.getenv("HOST", "0.0.0.0")
    if port is None:
        port = int(os.getenv("PORT", "8000"))

    import uvicorn
    print("\n" + "="*60)
    print(" 🚀 STARTING SPECIALIST AI AGENT WEB APPLICATION")
    print("="*60)
    print(f" • Local Web Interface: http://{host}:{port}")
    print(f" • OpenRouter Endpoint: {os.getenv('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1')}")
    print(f" • Default Model Slug:  {os.getenv('DEFAULT_MODEL', 'openrouter/free')}")
    print(f" • Local JSON Database: data/history.json")
    print(f" • Exports Supported:   PowerPoint (.pptx), Word (.docx), Excel (.xlsx), ZIP")
    print("="*60 + "\n")
    uvicorn.run("app:app", host=host, port=port, reload=False)

def run_cli():
    """Interactive command-line reasoning interface."""
    from agent import SpecialistAIAgent, DOMAINS
    import storage
    import exporter

    agent = SpecialistAIAgent()
    print("\n" + "="*60)
    print(" ⚡ SPECIALIST AI AGENT (CLI INTERACTIVE REASONING MODE)")
    print("="*60)
    print("Specialties available:")
    for key, val in DOMAINS.items():
        print(f"  [{key}]: {val['icon']} {val['label']}")
    print("\nType your question below (or 'exit' to quit):\n")

    while True:
        try:
            q = input("\n[You] > ").strip()
            if not q or q.lower() in ["exit", "quit", "q"]:
                print("Exiting Specialist AI Agent.")
                break

            print("\nThinking with domain specialist persona...")
            res = agent.ask(q, domain_choice="auto", model="openrouter/free")
            
            if res.get("success"):
                print(f"\n[{res['domain_label']} Specialist | Model: {res['model_used']}]")
                print("-" * 50)
                print(res["answer"])
                print("-" * 50)
                
                # Save to JSON
                rec = storage.add_record(
                    question=res["question"],
                    answer=res["answer"],
                    domain=res["domain"],
                    domain_label=res["domain_label"],
                    model_requested=res["model_requested"],
                    model_used=res["model_used"],
                    metadata={"latency_sec": res.get("latency_sec", 0)}
                )
                print(f"[Saved to data/history.json | ID: {rec['id']}]")
            else:
                print(f"Error: {res.get('error')}")

        except (KeyboardInterrupt, EOFError):
            print("\nSession ended.")
            break

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Specialist AI Agent Runner")
    parser.add_argument("--cli", action="store_true", help="Run in CLI interactive mode")
    parser.add_argument("--host", default=os.getenv("HOST", "0.0.0.0"), help="Host address for web server")
    parser.add_argument("--port", type=int, default=int(os.getenv("PORT", "8000")), help="Port for web server")

    args = parser.parse_args()

    if args.cli:
        run_cli()
    else:
        run_server(host=args.host, port=args.port)
