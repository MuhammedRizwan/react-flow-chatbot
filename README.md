# ChatBot Workflow Builder (React + React Flow)

A visual, node-based chatbot builder — built using **@xyflow/react (React Flow)**.

You can design chatbot logic visually using blocks like:

- Start
- Ask question
- wait for user input
- Validate user input
- Save to database
- AI-generated reply
- Fallback handling
- Error handling
- End flow

The goal: **build chatbot logic like drawing a flowchart — then execute it.**

---

## 🚀 Features

### 🧠 Workflow Nodes

| Node | Purpose |
|------|--------|
**Start** | Entry point of the flow  
**Ask** | Ask the user something + store answer 
**User Input** | waiting for the user input 
**Validation** | Check input (name rules, empty, etc.)  
**Database** | Save or read values (user.name etc.)  
**AI Node** | Generate replies using AI prompts  
**Fallback** | Used when AI/user input is unclear  
**Error** | Safe path when something fails  
**Reply / End** | Final response & exit  

> Everything is connectable, draggable, and fully editable.

---

## 🌊 Example Flow

