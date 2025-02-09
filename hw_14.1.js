"use strict";
class Todo {
    constructor(title, content) {
        if (!title.trim() || !content.trim()) {
            throw new Error("Нотаток не може бути порожнім");
        }
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
        return `Заголовок: ${this.title}\nЗміст: ${this.content}\nСтворено: ${this.createdAt}\nОновлено: ${this.updatedAt}\nСтатус: ${this.completed ? 'Виконано' : 'Не виконано'}`;
    }
    isCompleted() {
        return this.completed;
    }
    getCreatedAt() {
        return this.createdAt;
    }
}
class ConfirmableTodo extends Todo {
    confirmAction(message) {
        return typeof window !== 'undefined' ? confirm(message) : true;
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
    remove(todo) {
        if (todo instanceof ConfirmableTodo && !todo.confirmDelete()) {
            return;
        }
        this.todos = this.todos.filter(t => t !== todo);
    }
    getAll() {
        return [...this.todos]; // повертаємо копію
    }
    findByTitle(title) {
        return this.todos.find(todo => todo.title === title);
    }
    search(query) {
        return this.todos.filter(todo => todo.title.includes(query) || todo.content.includes(query));
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
