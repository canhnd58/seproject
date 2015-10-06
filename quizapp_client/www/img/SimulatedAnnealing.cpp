#include <ctime>
#include <cmath>
#include <string>
#include <cstdio>
#include <cstdlib>
#include <fstream>
#include <iostream>
#include <algorithm>
#define Debug(x) cout << x << endl

using namespace std;

const int MaxN = 125000; 
const double alpha = 0.99;
const double To = 1000;
const double esp = 1E-8;

struct board {
	int a[MaxN + 1];
	long long value;
	int le[2 * MaxN + 10];
	int ri[2 * MaxN + 10];
	int pos[2];
};

int n;
board X;

void init();
void Heuristic();
void reverseBoard();
void write();

void SA_n_queen(double alpha, double To) {
	// Set T = To
	double T = To;
	
	// Init sample
	
	init();

	while (X.value > 0) {		
		long long oldValue = X.value;
		Heuristic();
				
		if (X.value < oldValue) {
			// do nothing
			if (X.value == 0) break;
		} else {
			double r = (double)(rand() % 100 + 1) / 100;
			if (r - exp((double)(oldValue - X.value) / T) < esp) {
				// do nothing
			}
			else reverseBoard();
		} 
		T = alpha * T;
	}
}

int main() {
	n = 30000;
	srand(time(NULL));
	SA_n_queen(alpha, To);
	write();
}

long long Fitness() {
	long long value = 0;
	for (int i = 1; i <= n; i++) {
		value += (long long)(X.le[i - X.a[i] + n] - 1);
		value += (long long)(X.ri[i + X.a[i]] - 1);
	}
	return value;
}

void calculateIndex() {
	for (int i = 0; i < 2 * n + 10; i++) {
		X.le[i] = 0;
		X.ri[i] = 0;
	}
	for (int i = 1; i <= n; i++) {
		X.le[i - X.a[i] + n]++;
		X.ri[i + X.a[i]]++;
	}	
}

void init() {
	for (int i = 1; i <= n; i++) X.a[i] = i;
	calculateIndex();
	X.value = Fitness();
}

void Heuristic() {
	for (int i = 0; i < 2; i++) {
		X.pos[i] = rand() % n + 1;
	}

	for (int i = 0; i < 2; i++) {
		X.value -= 2 * (long long)(X.le[X.pos[i] - X.a[X.pos[i]] + n] - 1);
		X.value -= 2 * (long long)(X.ri[X.pos[i] + X.a[X.pos[i]]] - 1);
		X.le[X.pos[i] - X.a[X.pos[i]] + n]--;
		X.ri[X.pos[i] + X.a[X.pos[i]]]--;
	}
	swap(X.a[X.pos[0]], X.a[X.pos[1]]);
	for (int i = 0; i < 2; i++) {
		X.value += 2 * (long long)X.le[X.pos[i] - X.a[X.pos[i]] + n];
		X.value += 2 * (long long)X.ri[X.pos[i] + X.a[X.pos[i]]];
		X.le[X.pos[i] - X.a[X.pos[i]] + n]++;
		X.ri[X.pos[i] + X.a[X.pos[i]]]++;
	}	
}

void reverseBoard() {
	for (int i = 0; i < 2; i++) {
		X.value -= 2 * (long long)(X.le[X.pos[i] - X.a[X.pos[i]] + n] - 1);
		X.value -= 2 * (long long)(X.ri[X.pos[i] + X.a[X.pos[i]]] - 1);
		X.le[X.pos[i] - X.a[X.pos[i]] + n]--;
		X.ri[X.pos[i] + X.a[X.pos[i]]]--;
	}
	swap(X.a[X.pos[0]], X.a[X.pos[1]]);
	for (int i = 0; i < 2; i++) {
		X.value += 2 * (long long)X.le[X.pos[i] - X.a[X.pos[i]] + n];
		X.value += 2 * (long long)X.ri[X.pos[i] + X.a[X.pos[i]]];
		X.le[X.pos[i] - X.a[X.pos[i]] + n]++;
		X.ri[X.pos[i] + X.a[X.pos[i]]]++;
	}	
}

void write() {
	freopen("SolutionSA.txt", "w", stdout);
	cout << n << endl;
	for (int i = 1; i <= n; i++) {
		cout << X.a[i] << " ";
		if (i % 25 == 0) cout << endl;
	}
//	cout << endl;
//	cout << X.pos[0] << " " << X.pos[1] << " " << X.value << endl;
//	system("pause");
}
