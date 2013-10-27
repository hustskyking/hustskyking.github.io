---
layout: post
title: JavaScript实现各种排序算法
description: JavaScript实现插入排序、归并排序、堆排序、快速排序、计数排序
category: blog
---

今天看算法导论的排序，研究了一晚上和一下午，用JavaScript实现了下面五种排序算法，以下算法都只有实现的代码，具体的思路网上都有。

## 插入排序

	// 插入排序
	function insertSort(arr) {
		var i, j, k, temp, len = arr.length;
		for (i = 1; i < len; i++) {
			for (j = i-1; j >= 0; j--) {
				if (arr[j] < arr[i]) {
					break;
				}
			}
			if (j != i - 1) {
				temp = arr[i];
				for (k = i - 1; k > j; k--) {
					arr[k+1] = arr[k];
				}
				arr[j+1] = temp;
			}
		}
		return arr;
	}
	// 降序的插入排序
	// 思路：将arr[i]与数组0到i-1比较，若比较到arr[j] < arr[i]，说明j位置是arr[i]的插入位置
	// 然后将arr[j...i-1]的数组向后移，再将arr[i]插入到正确位置
	function insertDecrementSort(arr) {
		var i, j, k, temp, len = arr.length;
		for (i = 1; i < len; i++) {
			for (j = 0; j < i; j++) {
				if (arr[j] < arr[i]) {
					break;
				}
			}
			if (j != i) {
				temp = arr[i];
				for (k = i - 1; k >= j; k--) {
					arr[k+1] = arr[k];
				}
				arr[j] = temp;
			}
		}
		return arr;
	}
	var arr = [];
	for (var i = 0; i < 100; i++) {
		arr.push(Math.floor(Math.random()*1000));
	}
	console.profile('插入排序');
	console.log(insertSort(arr));
	console.profileEnd('插入排序');
	
![insertSort](/demo/images/insertSort.jpg)

## 归并排序

	/*
	 * 归并排序
	 * 1.递归对数组左边排序
	 * 2.递归对数组右边排序
	 * 3.合并数组左边和右边
	 */
	function mergeSort(arr) {
		var middle, left, right;
		if (arr.length == 1) {
			return arr;
		}
		middle = Math.floor(arr.length/2);
		left = arr.slice(0, middle);
		right = arr.slice(middle);
		return merge(mergeSort(left), mergeSort(right));
	}
	// 合并两个数组
	function merge(left, right) {
		var ret = [];
		while (left.length > 0 && right.length > 0) {
			if (left[0] > right[0]) {
				ret.push(right.shift());
			} else {
				ret.push(left.shift());
			}
		}
		return ret.concat(left, right);
	}
	// 产生随机的100个数，并push进arr中
	var arr = [];
	for (var i = 0; i < 100; i++) {
		arr.push(Math.floor(Math.random()*1000));
	}
	console.profile('归并排序');
	console.log(mergeSort(arr));
	console.profileEnd('归并排序');
	
![mergeSort](/demo/images/mergeSort.jpg)

## 堆排序

	/*
	 * 堆排序算法
	 * 1.maxHeap：保持堆的性质，使其为最大堆
	 * 2.bulidMaxHeap：建堆
	 * 3.heapSort：堆排序
	 */
	function heapSort(arr) {
		bulidMaxHeap(arr);
		for (var i = arr.length; i > 1; i--) {
			var temp = arr[0];
			arr[0] = arr[i - 1];
			arr[i - 1] = temp;
			maxHeapify(arr, 1, i - 1);
		}
		return arr;
	}
	function bulidMaxHeap(arr) {
		for (var i = arr.length/2; i > 0; i--) {
			maxHeapify(arr, i, arr.length);
		}
	}
	function maxHeapify(data, parentNodeIndex, heapSize) {  
		// 左子节点索引  
		var leftChildNodeIndex = parentNodeIndex * 2;  
		// 右子节点索引  
		var rightChildNodeIndex = parentNodeIndex * 2 + 1;  
		// 最大节点索引  
		var largestNodeIndex = parentNodeIndex;  

		// 如果左子节点大于父节点，则将左子节点作为最大节点  
		if (leftChildNodeIndex <= heapSize && data[leftChildNodeIndex - 1] > data[parentNodeIndex - 1]) {  
			largestNodeIndex = leftChildNodeIndex;  
		}  

		// 如果右子节点比最大节点还大，那么最大节点应该是右子节点  
		if (rightChildNodeIndex <= heapSize && data[rightChildNodeIndex - 1] > data[largestNodeIndex - 1]) {  
			largestNodeIndex = rightChildNodeIndex;  
		}  

		// 最后，如果最大节点和父节点不一致，则交换他们的值  
		if (largestNodeIndex != parentNodeIndex) {  
			var temp = data[parentNodeIndex - 1];
			data[parentNodeIndex - 1] = data[largestNodeIndex - 1];
			data[largestNodeIndex - 1] = temp;

			// 交换完父节点和子节点的值，对换了值的子节点检查是否符合最大堆的特性  
			maxHeapify(data, largestNodeIndex, heapSize);  
		}  
	}
	// 产生随机的100个数，并push进arr中
	var arr = [];
	for (var i = 0; i < 100; i++) {
		arr.push(Math.floor(Math.random()*1000));
	}
	console.profile('堆排序');
	console.log(heapSort(arr));
	console.profileEnd('堆排序');
	
![heapSort](/demo/images/heapSort.jpg)

## 快速排序

	function partition(arr, first, last) {
		var x = arr[last],
			i = first - 1,
			j, temp;
		for (j = first; j < last; j++) {
			if (arr[j] <= x) {
				i++;
				temp = arr[j];
				arr[j] = arr[i];
				arr[i] = temp;
			}
		}
		temp = arr[j];
		arr[j] = arr[i+1];
		arr[i+1] = temp;
		return i+1;
	}
	function quickSort(arr, first, last) {
		if (first < last) {
			var q = partition(arr, first, last);
			quickSort(arr, first, q-1);
			quickSort(arr, q+1, last);
		}
		return arr;
	}
	// 产生随机的100个数，并push进arr中
	var arr = [];
	for (var i = 0; i < 100; i++) {
		arr.push(Math.floor(Math.random()*1000));
	}
	console.profile('快速排序');
	console.log(quickSort(arr, 0, 99));
	console.profileEnd('快速排序');
	
![quickSort](/demo/images/quickSort.jpg)

## 计数排序

	/*
	 * 计数排序
	 * arr[0...n-1]输入数组
	 * temp[0...n-1]存放排序结果的
	 * c[0...k]提供临时存储区
	 * arr数组中的值必须小于k
	 */
	function countingSort(arr) {
		var i, k = 1000,
			len = arr.length,
			temp = [],
			c = [];
		for (i = 0; i < k; i++) {
			c[i] = 0;
		}
		for (i = 0; i < len; i++) {
			c[arr[i]] = c[arr[i]] + 1;
		}
		for (i = 1; i < k; i++) {
			c[i] = c[i] + c[i-1];
		}
		for (i = len - 1; i >= 0; i--) {
			temp[c[arr[i]]] = arr[i];
		}
		return temp;
	}
	// 产生随机的100个数，并push进arr中
	var arr = [];
	for (var i = 0; i < 100; i++) {
		arr.push(Math.floor(Math.random()*1000));
	}
	console.profile('计数排序');
	console.log(countingSort(arr));
	console.profileEnd('计数排序');

![countingSort](/demo/images/countingSort.jpg)
