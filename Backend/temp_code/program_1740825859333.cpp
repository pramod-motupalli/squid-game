#include<stdio.h>
void main(){
  int a=5,b=10;
  a=b+a;
  b=a-b;
  a=a-b;
  printf("a=%d b=%d",a,b);
}