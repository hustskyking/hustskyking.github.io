---
layout: post
title: JavaScript Hash Table(哈希表)
description: JavaScript哈希表的实现
category: blog
---

	function HashTable(obj) {
		this.length = 0;
		this.items = {};
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				this.items[key] = obj[key];
				this.length++;
			}
		}
		// 判断是否有键值为key的items
		this.hasItem = function(key) {
			return this.items.hasOwnProperty(key);
		};
		// 设置键值为key的元素的值为value
		this.setItem = function(key, value) {
			if (this.hasItem(key)) {
				var prev = this.items[key];
			} else {
				this.length++;
			}
			this.items[key] = value;
			return prev;
		};
		// 通过键值key获取元素的值
		this.getItem = function(key) {
			if (this.hasItem(key)) {
				return this.items[key];
			}
			return undefined;
		};
		// 移除键值为key的元素
		this.removeItem = function(key) {
			if (this.hasItem(key)) {
				var prev = this.items[key];
				this.lenght--;
				delete this.items[key];
				return prev;
			}
			return undefined;
		};
		// 获取所有的键值keys
		this.keys = function() {
			var keys = [];
			for (var key in this.items) {
				if (this.items.hasOwnProperty(key)) {
					keys.push(key);
				}
			}
			return keys;
		};
		// 获取所有的values
		this.values = function() {
			var value = [];
			for (var key in this.items) {
				if (this.items.hasOwnProperty(key)) {
					values.push(this.items[key]);
				}
			}
			return values;
		};
		// 清空items
		this.clear = function() {
			this.items = {};
			this.length = 0;
		};
	}

	var hash = new HashTable({name: 'zhangmin', age: 22, home: 'Jiujiang'});
	console.log(hash.length);
	console.log(hash.getItem('name'));
	console.log(hash.clear());
	console.log(hash.length);
