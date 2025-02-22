class Todo {
    public readonly id: string;
    public title: string;
    public content: string;
    protected createdAt: Date;
    protected updatedAt: Date;
    protected completed: boolean;

    constructor(title: string, content: string) {
        if (!title.trim() || !content.trim()) {
            throw new Error("Нотаток не може бути порожнім");
        }
        this.id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
        this.title = title;
        this.content = content;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.completed = false;
    }

    edit(newTitle: string, newContent: string): void {
        if (!newTitle.trim() || !newContent.trim()) {
            throw new Error("Назва та зміст не можуть бути порожніми");
        }
        this.title = newTitle;
        this.content = newContent;
        this.updatedAt = new Date();
    }

    toggleComplete(): void {
        this.completed = !this.completed;
    }

    getInfo(): string {
        return `Заголовок: ${this.title}\nЗміст: ${this.content}\nСтворено: ${this.createdAt.toLocaleString()}\nОновлено: ${this.updatedAt.toLocaleString()}\nСтатус: ${this.completed ? 'Виконано' : 'Не виконано'}`;
    }

    isCompleted(): boolean {
        return this.completed;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }
}

class ConfirmableTodo extends Todo {
    private confirmAction: (message: string) => boolean;

    constructor(title: string, content: string, confirmAction: (message: string) => boolean = (msg) => confirm(msg)) {
        super(title, content);
        this.confirmAction = confirmAction;
    }

    edit(title: string, content: string): void {
        if (this.confirmAction("Ви впевнені, що хочете редагувати нотаток?")) {
            super.edit(title, content);
        }
    }

    confirmDelete(): boolean {
        return this.confirmAction("Ви впевнені, що хочете видалити цей нотаток?");
    }
}

class TodoList {
    private todos: Todo[] = [];

    add(todo: Todo): void {
        this.todos.push(todo);
    }

    remove(todoId: string): void {
        const todo = this.findById(todoId);
        if (!todo) {
            console.warn("Нотаток не знайдено!");
            return;
        }
        if (todo instanceof ConfirmableTodo && !todo.confirmDelete()) {
            return;
        }
        this.todos = this.todos.filter(t => t.id !== todoId);
    }

    getAll(): Todo[] {
        return [...this.todos];
    }

    findById(id: string): Todo | undefined {
        return this.todos.find(todo => todo.id === id);
    }

    editTodo(id: string, newTitle: string, newContent: string): void {
        const todo = this.findById(id);
        if (!todo) {
            console.warn("Нотаток не знайдено!");
            return;
        }
        todo.edit(newTitle, newContent);
    }

    search(query: string): Todo[] {
        const lowerQuery = query.toLowerCase();
        return this.todos.filter(todo => 
            todo.title.toLowerCase().includes(lowerQuery) || todo.content.toLowerCase().includes(lowerQuery)
        );
    }

    getStats(): string {
        const total = this.todos.length;
        const pending = this.todos.filter(todo => !todo.isCompleted()).length;
        return `Всього нотатків: ${total}, невиконаних: ${pending}`;
    }

    sortByStatus(): void {
        this.todos.sort((a, b) => Number(a.isCompleted()) - Number(b.isCompleted()));
    }

    sortByDate(): void {
        this.todos.sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime());
    }
}
