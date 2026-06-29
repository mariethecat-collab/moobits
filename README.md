# Here are your Instructions
## Setup

### 1. Clone repository

```bash
git clone https://github.com/USERNAME/REPOSITORY.git
```

### 2. Install dependencies

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd ../backend
pip install -r requirements.txt
```

### 3. Create environment files

Copy the example files:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Then fill in the required environment variable values.

### 4. Run the project

Frontend:

```bash
npm start
```

Backend:

```bash
python server.py
```