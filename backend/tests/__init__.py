import subprocess


def start_tests():
    subprocess.run(["poetry", "run", "pytest", "./", "--asyncio-mode=strict"])
