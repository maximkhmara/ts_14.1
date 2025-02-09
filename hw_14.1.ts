class Todo {
    public readonly title: string;
    public readonly content: string;
    protected createdAt: Date;
    protected updatedAt: Date;
    protected completed: boolean;

    constructor(title: string, content: string) {
        if (!title.trim() || !content.trim()) {
            throw new Error("Нотаток не може бути порожнім");
        }
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
        (this as any).title = newTitle;
        (this as any).content = newContent;
        this.updatedAt = new Date();
    }

    toggleComplete(): void {
        this.completed = !this.completed;
    }

    getInfo(): string {
        return `Заголовок: ${this.title}\nЗміст: ${this.content}\nСтворено: ${this.createdAt}\nОновлено: ${this.updatedAt}\nСтатус: ${this.completed ? 'Виконано' : 'Не виконано'}`;
    }

    isCompleted(): boolean {
        return this.completed;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }
}

class ConfirmableTodo extends Todo {
    private confirmAction(message: string): boolean {
        return typeof window !== 'undefined' ? confirm(message) : true;
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

    remove(todo: Todo): void {
        if (todo instanceof ConfirmableTodo && !todo.confirmDelete()) {
            return;
        }
        this.todos = this.todos.filter(t => t !== todo);
    }

    getAll(): Todo[] {
        return [...this.todos];
    }

    findByTitle(title: string): Todo | undefined {
        return this.todos.find(todo => todo.title === title);
    }

    search(query: string): Todo[] {
        return this.todos.filter(todo => 
            todo.title.includes(query) || todo.content.includes(query)
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