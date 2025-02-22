"use strict";
class Todo {
    constructor(title, content) {
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
    edit(newTitle, newContent) {
        if (!newTitle.trim() || !newContent.trim()) {
            throw new Error("Назва та зміст не можуть бути порожніми");
        }
        this.title = newTitle;
        this.content = newContent;
        this.updatedAt = new Date();
    }
    toggleComplete() {
        this.completed = !this.completed;
    }
    getInfo() {
        return `Заголовок: ${this.title}\nЗміст: ${this.content}\nСтворено: ${this.createdAt.toLocaleString()}\nОновлено: ${this.updatedAt.toLocaleString()}\nСтатус: ${this.completed ? 'Виконано' : 'Не виконано'}`;
    }
    isCompleted() {
        return this.completed;
    }
    getCreatedAt() {
        return this.createdAt;
    }
}
class ConfirmableTodo extends Todo {
    constructor(title, content, confirmAction = (msg) => confirm(msg)) {
        super(title, content);
        this.confirmAction = confirmAction;
    }
    edit(title, content) {
        if (this.confirmAction("Ви впевнені, що хочете редагувати нотаток?")) {
            super.edit(title, content);
        }
    }
    confirmDelete() {
        return this.confirmAction("Ви впевнені, що хочете видалити цей нотаток?");
    }
}
class TodoList {
    constructor() {
        this.todos = [];
    }
    add(todo) {
        this.todos.push(todo);
    }
    remove(todoId) {
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
    getAll() {
        return [...this.todos];
    }
    findById(id) {
        return this.todos.find(todo => todo.id === id);
    }
    editTodo(id, newTitle, newContent) {
        const todo = this.findById(id);
        if (!todo) {
            console.warn("Нотаток не знайдено!");
            return;
        }
        todo.edit(newTitle, newContent);
    }
    search(query) {
        const lowerQuery = query.toLowerCase();
        return this.todos.filter(todo => todo.title.toLowerCase().includes(lowerQuery) || todo.content.toLowerCase().includes(lowerQuery));
    }
    getStats() {
        const total = this.todos.length;
        const pending = this.todos.filter(todo => !todo.isCompleted()).length;
        return `Всього нотатків: ${total}, невиконаних: ${pending}`;
    }
    sortByStatus() {
        this.todos.sort((a, b) => Number(a.isCompleted()) - Number(b.isCompleted()));
    }
    sortByDate() {
        this.todos.sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime());
    }
}
