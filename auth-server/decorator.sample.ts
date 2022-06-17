class Queue {
  private readonly _arr: Array<any>;
  private readonly maxSize: number;
  private curSize: number;
  private lock: boolean;

  constructor(size: number) {
    this.maxSize = size;
    this._arr = [];
    this.curSize = 0;
    this.lock = false;
  }

  _doLock(): void {
    this.lock = true;
  }

  _doFree(): void {
    this.lock = false;
  }

  @queueLock()
  enqueue(item: any): boolean {
    if (this.curSize >= this.maxSize) {
      return false;
    }
    this._doLock();
    this._arr.push(item);
    this.curSize += 1;
    this._doFree();
    return true;
  }

  @queueLock()
  dequeue(): any {
    this._doLock();
    this.curSize -= 1;
    this._doFree();
    return this._arr.shift();
  }
}

function queueLock() {
  return function (target: any, name: string, descriptor: PropertyDescriptor) {
    // target: ?
    // name: 데코레이터된 함수 이름
    // original: 함수
    const original = descriptor.value;
    // args: 데코레이터된 함수의 인자 ... [10]
    descriptor.value = function (...args) {
      // this: 클래스의 인스턴스
      // apply의 반환 값: 데코레이터된 함수의 리턴 값
      if (this['lock'] === true) {
        return false;
      }
      const result = original.apply(this, args);
      return result;
    };
  };
}

const q = new Queue(10);
q.enqueue(10);
const res = q.dequeue();
console.log(res);
