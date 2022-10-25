abstract class NumberGenerator {
    observers: Observer[] = [];
    addObserver(observer: Observer) {
      this.observers.push(observer);
    }
    removeObserver() {
      // TODO
    }
  
    notifyObservers(generator: NumberGenerator) {
      this.observers.forEach((observer) => observer.update(this));
    }
  
    abstract getNumber(): number;
    abstract execute(): void;
  }
  
  class RandomNumberGenerator extends NumberGenerator {
    number: number = 0;
    getNumber() {
      return this.number;
    }
    execute() {
      this.number = 2;
      this.notifyObservers(this);
    }
  }
  
  abstract class Observer {
    abstract update(generator: NumberGenerator): void;
  }
  
  class DigitObserver extends Observer {
    update(generator: NumberGenerator) {
      const num = generator.getNumber();
      const updatedNum = num * 2;
      console.log('DigitObserver get number, will do some updates: ', updatedNum);
    }
  }
  
  class GraphObserver extends Observer {
    update(generator: NumberGenerator) {
      const num = generator.getNumber();
      const updatedNum = num * 4;
      console.log('GraphObserver: get number, will do some updates: ', updatedNum);
    }
  }

function testObserver():void{
    const dObserver = new DigitObserver();
    const gObserver = new GraphObserver();

    const subjectInstance = new RandomNumberGenerator();

    subjectInstance.addObserver(dObserver);
    subjectInstance.addObserver(gObserver);

    subjectInstance.execute();
}
testObserver();
