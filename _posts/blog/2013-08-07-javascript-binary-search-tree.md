---
layout: post
title: JavaScript 二叉搜索树
description: JavaScript实现的二叉搜索树，实现了插入，删除，前驱，后继，最大值，最小值
category: blog
---

今天早上起来就开始研究二叉搜索树，研究了一上午，用JavaScript实现了各种操作。直接上代码：

	// 二叉搜索树节点类
	var Node = function(v) {
		this.value = v;
		this.left = null;
		this.right = null;
		this.parent = null;
	}

	// 二叉搜索树类
	var BinarySearchTree = function() {

		// 初始化根节点为null
		this.root = null;
		var self = this;

		// 插入节点
		this.insert = function(v) {
			var newNode = new Node(v);
			// 如果根节点为null，则插入的是根节点
			if (this.root === null) {
				this.root = newNode;
				return;
			}
			var currentNode = this.root,
				parentNode = null;			// parentNode始终指向currentNode的父节点
			while (true) {
				parentNode = currentNode;
				if (v < currentNode.value) {
					currentNode = currentNode.left;
					if (currentNode == null) {
						parentNode.left = newNode;
						newNode.parent = parentNode;
						return;
					}
				} else {
					currentNode = currentNode.right;
					if (currentNode == null) {
						parentNode.right = newNode;
						newNode.parent = parentNode;
						return;
					}
				}
			}
		};

		// 删除结点
		// 1.删除结点没有左子树和右子树的情况，修改删除结点的父节点为null(判断删除结点是左子树还是右子树)
		// 2.删除结点有左子树或者右子树，把删除结点的左子树或右子树修改为父节点的左子树或右子树
		// 3.删除结点有左子树和右子树，先找到删除结点的后继，先删除后继，再用后继来代替删除结点的内容
		this.delete = function(v) {
			var pnode = this.search(v),
				realDelNode,
				childNode;
			if (pnode != null) {
				if (pnode.left == null || pnode.right == null) {
					realDelNode = pnode;
				} else {
					realDelNode = this.successor(pnode.value);
				}
				if (realDelNode.left != null) {
					childNode = realDelNode.left;
				} else {
					childNode = realDelNode.right;
				}
				if (childNode != null) {
					childNode.parent = realDelNode.parentNode;
				}
				if (realDelNode.parent == null) {
					this.root = realDelNode;
				} else if (realDelNode == realDelNode.parent.left)  {
					realDelNode.parent.left = childNode;
				} else {
					realDelNode.parent.right = childNode;
				}
				if (realDelNode !== pnode) {
					pnode.value = realDelNode.value;
				}
			}
		};

		/*
		 * 二叉搜索树————查找
		 * 1.判断查找元素和根元素
		 * 2.若小于根元素，递归查找根元素的左子树
		 * 3.若大于根元素，递归查找根元素的右子树
		 */
		this.search = function(v) {
			var pnode = this.root;
			while(pnode != null) {
				if (pnode.value == v) {
					break;
				} else if (pnode.value < v) {
					pnode = pnode.right;
				} else {
					pnode = pnode.left;
				}
			}
			return pnode;
		};

		/*
		 * 二叉搜索树————前驱
		 * 1.结点的左子树不为空的情况下，结点的前驱为左子树的最右结点
		 * 2.结点的左子树为空的情况下，若为父节点的右子树，则前驱就为父母
		 * 3.结点的左子树为空，若为父节点的左子树，则需要通过回溯找到第一个右祖先
		 */
		this.predecessor = function(v) {
			var pnode = this.search(v);
			if (pnode.left != null) {
				return this.max(pnode.left);
			}
			var parentNode = pnode.parent;
			while (parentNode && pnode == parentNode.left) {
				pnode = parentNode;
				parentNode = parentNode.left;
			}
			if (parentNode) {
				return parentNode;
			}
		};

		/*
		 * 二叉搜索树————中序遍历的后继
		 * 1.结点的右子树不为空的话，后继就是右子树的最左结点
		 * 2.右子树为空，则后继为结点的第一个左祖先结点，需通过回溯
		 */
		this.successor = function(v) {
			// 寻找v的位置
			var pnode = this.search(v);
			// 如果结点的右结点不为空，则后继为右子树的最左结点
			if (pnode.right != null) {
				return this.min(pnode.right);
			}
			// 右结点为空的情况下，则后继为结点的最低祖先结点
			var parentNode = pnode.parent;
			while (parentNode && pnode == parentNode.right) {
				pnode = parentNode;
				parentNode = parentNode.parent;
			}
			if (parentNode) {
				return parentNode;
			}
		};

		/*
		 * 二叉搜索树是否为空
		 * 即判断根节点是否为null
		 */
		this.empty = function() {
			return this.root == null;
		}

		// 二叉搜索树最小值
		this.min = function(node) {
			var p = node;
			while (p != null && p.left != null) {
				p = p.left;
			}
			return p;
		};

		// 二叉搜索树最大值
		this.max = function(node) {
			var p = node;
			while (p != null && p.right != null) {
				p = p.right;
			}
			return p;
		};

		// 中序遍历
		this.inOrder = function(rootNode) {
			if (rootNode != null) {
				this.inOrder(rootNode.left);
				console.log(rootNode.value);
				this.inOrder(rootNode.right);
			}
		};


		// 中序非递归遍历
		this.inOrderNotRec = function(rootNode) {
			var ret = [], p;
			ret.push(rootNode);
			while (ret.length != 0) {
				while (ret[ret.length - 1]) {
					p = ret[ret.length - 1];
					ret.push(p.left);
				}
				ret.pop();
				if (ret.length != 0) {
					console.log(p = ret.pop());
					ret.push(p.right);
				}
			}
		}

		// 先序遍历
		this.preOrder = function(rootNode) {
			if (rootNode != null) {
				console.log(rootNode.value);
				this.preOrder(rootNode.left);
				this.preOrder(rootNode.right);
			}
		};

		// 后序遍历
		this.postOrder = function(rootNode) {
			if (rootNode != null) {
				this.postOrder(rootNode.left);
				this.postOrder(rootNode.right);
				console.log(rootNode.value);
			}
		};
	}

	var bst = new BinarySearchTree();
	bst.insert(6);
	bst.insert(3);
	bst.insert(7);
	bst.insert(2);
	bst.insert(1);
	bst.insert(4);
	bst.insert(5);
	bst.insert(10);
	bst.insert(8);
	bst.insert(9);
	console.log(bst.min(bst.root));
	console.log(bst.max(bst.root));
	bst.inOrder(bst.root);
	console.log(bst.search(9));
	console.log("***************");
	bst.delete(3);
	bst.inOrderNotRec(bst.root);