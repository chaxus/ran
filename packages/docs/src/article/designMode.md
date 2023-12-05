# 23 classic design patterns

> The Design Pattern is a set of frequently used, widely known, cataloged code design experiences that are used in order to reuse code, make it easier for others to understand, and ensure code reliability.

In the book "Design Patterns: The Foundation of Reusable Object-Oriented Software" introduced 23 classic design patterns, but the design pattern is not only these 23, with the development of software development industry, more and more new patterns continue to be born and applied. Experienced developers learn design patterns that can be corroborated with past experience, making it easier to understand them.

A design pattern generally contains elements such as the pattern name, problem, purpose, solution, and effect. The problem describes when patterns should be used, and it contains problems with the design and why they exist. A solution describes the components of a design pattern and how these components relate to each other, their respective responsibilities, and how they work together. Typically, the solution is described through UML class diagrams and core code. Effects describe the advantages and disadvantages of the pattern and the trade-offs that should be made when using the pattern.

**Why learn design patterns**:

- Design patterns are derived from the experience and wisdom of many experts. They are successful and reusable design solutions from many excellent software systems. Using these solutions will allow us to avoid doing some repetitive work

- Design patterns provide a common set of design vocabulary and a common form to facilitate communication and exchange between developers, making design solutions more understandable

- Most of the design patterns take into account the reusability and extensibility of the system, which enables us to better reuse some existing design schemes, functional modules and even a complete software system, so as to avoid us often doing some repetitive design and writing some repetitive code

- Proper use of design patterns and documentation of their use will help others understand the system more quickly

- Learning design patterns will help beginners understand object-oriented ideas more deeply

**Reserve knowledge**：

- Abstract class: The general abstract class is as a base class, for example, "computer" can be used as an abstract class, according to the abstract class derived "desktop computer" and "laptop computer" 2 concrete classes. Abstract classes are generally not instantiated.

- Combination is better than inheritance: inheritance cannot be abused to expand functionality, and combination is more flexible. Also take the "computer" abstract class for example, if we use inheritance to distinguish different types of "computer" we can derive "desktop computer" and "laptop computer", if we add another dimension, according to the brand can continue to subdivide "Lenovo desktop computer", "Lenovo laptop", "Apple desktop computer" and "Apple laptop" and so on. If you add another dimension and continue to subdivide, it is clear that inheritance is not adequate. At this time, you can use inheritance and composition, and the combined object can also be abstract design:

  ```ts
  interface Brand {
    // ...
  }
  interface Lenovo extends Brand {
    // ...
  }
  interface Apple extends Brand {
    // ...
  }
  interface CPU {
    // ...
  }
  interface Inter extends CPU {
    // ...
  }
  interface AMD extends CPU {
    // ...
  }
  interface Computer {
    // ...
  }

  interface DesktopComputer extends Computer {}
  interface NotebookComputer extends Computer {}
  ```

## 一、UML class diagram

Each pattern has a corresponding object structure diagram, and in order to show the details of the interaction between objects, sometimes a 'UML' diagram is used to show how it works. Here will not be the various elements of 'UML' mentioned, just want to talk about the relationship between the classes in the class diagram, can understand the meaning of the lines and arrows between the classes in the class diagram, it is enough to deal with daily work and communication. At the same time, we should be able to match the meaning of the class diagram to the final code. With this knowledge, there is no problem looking at the design pattern structure diagram in the later sections.

<!-- 本文中大部分是 UML 类图，也有个别简易流程图。由于文中部分模式并未配图，你可以在[这里](../../assets/article/designPattern/UML/创建型/单例.jpg)查看我在网络上收集的完整 23 种设计模式 UML 类图。 -->

### 1.1 inherit

Inheritance is represented directly by a hollow arrow.

![](../../assets/article/designPattern/继承.png)

### 1.2 realize

The implementation relationship is represented by a dashed line with a hollow arrow.

![](../../assets/article/designPattern/实现.png)

### 1.3 assembly

Like aggregation relations, composition relations also represent the semantics of a whole made up of parts. For example, a company is composed of multiple departments, but the combinatorial relationship is a special aggregation relationship of strong dependence, if the whole does not exist, then the part does not exist. For example, the company no longer exists, and the department will no longer exist.

![](../../assets/article/designPattern/组合.png)

### 1.4 Polymerization

Aggregation relationships are used to represent relationships between entity objects, representing the semantics of a whole made up of parts, such as a department consisting of multiple employees. Unlike combinatorial relations, the whole and the part are not strongly dependent, and even if the whole does not exist, the part still exists. For example, if the department is abolished, the personnel will not disappear, they will still exist.

![](../../assets/article/designPattern/聚合.png)

### 1.5 Association

The association relationship is expressed by a straight line, which describes the structural relationship between objects of different classes. It is a static relationship, usually unrelated to the running state, and generally determined by common sense and other factors. It is generally used to define the static, natural structure between objects, so the association relationship is a "strong association" relationship.

For example, the relationship between the passenger and the ticket is an association relationship, the student and the school is an association relationship, the association relationship does not emphasize the direction by default, indicating that the object knows each other. If particular emphasis is placed on direction, as shown in the figure below, it means that A knows B, but B does not know A.

![](../../assets/article/designPattern/关联.png)

### 1.6 dependence

Dependencies are represented by A set of dotted lines with arrows, such as A depends on B, which describes the relationship between one object and another object at runtime.

Unlike an association relationship, it is a temporary relationship that usually occurs during run time, and dependencies may change as the run time changes. Obviously, dependence also has a direction, two-way dependence is a very bad structure, we should always maintain one-way dependence, eliminate the generation of two-way dependence.

![](../../assets/article/designPattern/依赖.png)

## Two, six principles

### 2.1 Open and Close principle

&gt; A software entity should be open for extension and closed for modification. That is, software entities should extend as far as possible without modifying the original code.

An important issue for any software is that its requirements change over time. When the software system needs to face new requirements, we should try to ensure that the design framework of the system is stable. If a software design conforms to the open-close principle, it can be very convenient to extend the system, and there is no need to modify the existing code when expanding, so that the software system has good stability and continuity while having adaptability and flexibility. As the software scale becomes larger and larger, the software life becomes longer and longer, and the software maintenance cost becomes higher and higher, it becomes more and more important to design the software system that meets the principle of open and close.

In order to meet the open-close principle, the system needs to be abstract design, abstraction is the key to the open-close principle. In programming languages such as Java and C#, a relatively stable abstraction layer can be defined for the system, and different implementation behaviors can be moved to the concrete implementation layer. In many object-oriented programming languages, interfaces, abstract classes and other mechanisms can be used to define the abstract layer of the system, and then extend it through concrete classes. If it is necessary to modify the behavior of the system, there is no need to make any changes to the abstract layer, only need to add new concrete classes to achieve new business functions, to achieve the expansion of the system function on the basis of not modifying the existing code, to meet the requirements of the open-close principle.

Advantages: The advantage of practicing the open-close principle is that you can extend the function of the program without changing the original code. The expansibility of the program is increased, and the maintenance cost of the program is reduced. \*\*.

### 2.2 Richter Substitution Principle

&gt; Any reference to a base class object can transparently use the object of its subclass

The Richter substitution principle tells us that replacing a base class object with its subclass object in software will not cause any errors and exceptions, and the reverse is not true, if a software entity uses a subclass object, then it may not be able to use the base class object. For example, if I like animals, then I must like dogs, because dogs are a subclass of animals. But I like dogs, and it does not follow that I like animals, because I do not like mice, even though they are animals.

For example, if there are two classes, one is BaseClass, the other is SubClass, and the SubClass is a subclass of the BaseClass class, then a method can accept a base class object of type BaseClass, such as: method1(base), then it must accept a subclass object of type BaseClass sub, and method1(sub) will work. The reverse substitution is not true, if a method method2 accepts sub of type BaseClass as an argument: method2(sub), then in general you can't have method2(base) unless it's an overloaded method.

Richter substitution principle is one of the important ways to achieve the open and close principle, because the use of base class objects can use subclass objects, so in the program to try to use the base class type to define the object, and then determine its subclass type at run time, with subclass objects to replace the parent object.

** Advantages: You can test the correctness of the use of inheritance, and restrict the overflow of inheritance in use. **.

2.3 Reliance on the inversion principle

&gt; Abstractions should not depend on concrete classes, and concrete classes should depend on abstractions. In other words, program against the interface, not the implementation.

The principle of dependency inversion requires us to refer to high-level abstract layer classes as far as possible when passing parameters in program code or in association relations, that is, to use interfaces and abstract classes for variable type declaration, parameter type declaration, method return type declaration, and data type conversion, etc., rather than using concrete classes to do these things. In order to ensure the application of this principle, a concrete class should only implement methods declared in the interface or abstract class, and not give extra methods, otherwise it will not be able to call the new methods added in the subclass.

After the introduction of the abstraction layer, the system will have good flexibility, in the program as far as possible to use the abstraction layer for programming, and the specific class is written in the configuration file, so that if the system behavior changes, only need to extend the abstraction layer, and modify the configuration file, without modifying the original system source code, in the case of no modification to expand the function of the system. Meet the requirements of the open and close principle.

Advantages: Build a framework through abstraction and establish associations between classes to reduce coupling between classes. Moreover, the system built with abstraction is more stable, more scalable, and easier to maintain than the system built with concrete implementation. \*\*.

2.4 Principle of single responsibility

&gt; A class is only responsible for the corresponding responsibilities in one functional area, or it can be defined that there should be only one reason for a class to change.

The principle of single responsibility tells us that a class can't be too "tired"! In a software system, the more responsibilities a class (from large modules to small methods) takes on, the less likely it is to be reused, and too many responsibilities a class takes on, the equivalent of coupling these responsibilities together, when one of the responsibilities changes, it may affect the operation of the other responsibilities, so the separation of these responsibilities. Encapsulate different responsibilities in different classes, that is, encapsulate different reasons for change in different classes, and encapsulate multiple responsibilities in the same class if they always change at the same time.

The principle of single responsibility is a guideline to achieve high cohesion and low coupling. It is the simplest but most difficult principle to apply. It requires designers to discover different responsibilities of a class and separate them, while discovering multiple responsibilities of a class requires designers to have strong analysis and design ability and relevant practical experience.

Advantages: If the class and method responsibilities are clearly divided, not only can improve the readability of the code, but also effectively reduce the risk of program errors, because the clear code will make the bug nowhere to hide, but also conducive to bug tracking, that is, reduce the maintenance cost of the program. \*\*.

### 2.5 Demeter's Law (Least Know Principle)

&gt; A software entity should interact with other entities as little as possible

If a system conforms to Dimitar's law, then when one of the modules is modified, it will affect the other modules as little as possible, and it will be relatively easy to expand, which is a limit on the communication between software entities, Dimitar's law requires limiting the width and depth of communication between software entities. Demeter's rule can reduce the coupling degree of the system and keep the loose coupling relationship between classes.

Demeter's law requires that when designing a system, we should minimize the interaction between objects, if two objects do not need to communicate directly with each other, then the two objects should not have any direct interaction, if one of the objects needs to call a method of another object, you can forward the call through a third party. In short, it is to reduce the coupling degree between existing objects by introducing a reasonable third party.

When applying Dimitter's rule to system design, we should pay attention to the following points: in the division of classes, we should try to create loosely coupled classes, the lower the degree of coupling between classes, the more conducive to reuse, and once a class in loose coupling is modified, it will not cause too much impact on the associated classes. In the structural design of the class, every class should minimize the access permissions of its member variables and member functions. In class design, whenever possible, a type should be designed as an invariant class. References to other classes from one object should be kept to a minimum.

** Advantages: The practice of Demeter's rule can well reduce the coupling between classes, reduce the degree of correlation between classes, and make the collaboration between classes more direct. **.

2.6 Interface Separation Rule

&gt; The use of multiple specialized interfaces rather than a single general interface means that the client should not rely on interfaces that it does not need.

According to the principle of interface isolation, when an interface is too large, we need to split it into smaller interfaces, and the client using the interface only needs to know the methods associated with it. Each interface should assume a relatively independent role, do not do what should not be done, do what should be done.

When using the interface isolation principle, you need to pay attention to the granularity of the control interface. If the interface is too small, the system may overflow interfaces, which is not conducive to maintenance. The interface can not be too large, too large interface will violate the interface isolation principle, poor flexibility, very inconvenient to use.

** Advantages: Avoid the method of containing different responsibilities in the same interface, and the division of interface responsibilities is more clear, in line with the idea of high cohesion and low coupling. **.

### 2.7 Principle of Synthetic reuse (outside the six)

&gt; Try to use object composition rather than inheritance for reuse purposes

The principle of composite reuse is to use some existing objects in a new object through association relations (including composition relations and aggregation relations), so that it becomes part of the new object, and the new object achieves the purpose of reuse functions by delegating methods to the existing object. In short, when reuse, use composition/aggregation relationships (association relationships) as much as possible and use inheritance less.

In object-oriented design, there are two ways to reuse existing designs and implementations in different environments, namely through composition/aggregation relationships or through inheritance, but the use of composition/aggregation should be considered first. Composition/aggregation can make the system more flexible and reduce the coupling degree between classes. Changes in a class have relatively little impact on other classes, and then inheritance is considered. When using inheritance, it is necessary to strictly follow the Richlist substitution principle. Effective use of inheritance will help to understand the problem and reduce complexity, while abuse of inheritance will increase the difficulty of system construction and maintenance as well as the complexity of the system, so inheritance reuse should be carefully used.

** Advantages: Avoid abuse of inheritance when reuse, rational use of combination relations, increase flexibility. **.

2.8 Six principles - Learning experience

Among the six principles, the opening and closing principle, the Richter replacement principle, and the dependence and inversion principle are closely related, and the latter two are important prerequisites for realizing the opening and closing principle, and they have good scalability and maintainability through abstract design in use.

The principle of knowing the least can reduce coupling, reduce unnecessary interaction, advocate the design of interfaces and classes to be simple and easy to use, encapsulate complex logic and provide simple and easy-to-use interfaces.

** Single Responsibility principle ** Divide the classes and methods in a project by responsibility to avoid overburdening a single class. The more responsibilities, the less likely they are to be reused or the more cumbersome they are to use.

** Interface separation principle ** The function of the complex interface is subdivided into a number of specific functions of the interface, only do the thing to do, reduce the coupling, but the granularity can not be too fine, easy to lead to too many interfaces. The single responsibility principle emphasizes the design of a single class according to the subdivision of responsibilities, and the interface separation principle emphasizes the coupling between classes to establish the least possible dependency.

## III. Pattern classification

There are 23 distinct design patterns in Design Patterns: The Foundations of Reusable Object-Oriented Software, each of which provides a solution to a repeatable design problem. According to their purpose, design patterns can be divided into three types: 'Creational', 'Structural' and 'Behavioral', in which the creational pattern is mainly used to describe how to create objects, and the structural pattern is mainly used to describe how to achieve the combination of classes or objects. Behavioral patterns are primarily used to describe how classes or objects interact and how responsibilities are assigned.

In addition, design patterns can be divided into class patterns and object patterns, depending on whether a pattern primarily deals with relationships between classes or between objects. We often use a combination of the two categories, for example, the singleton pattern is the object creation pattern, and the template method pattern is the class behavior pattern.

3.1 Create type

The 'Creational Pattern' abstracts the class instantiation process, separating the creation and use of objects in a module. In order to make the structure more clear, the outside world only needs to know their common interface for these objects, but is not clear about its specific implementation details, so that the design of the whole system is more in line with the principle of single responsibility.

1. Simple Factory Pattern (' Simple Factory pattern ')
2. Factory Method Pattern (' Factory method pattern ')
3. Abstract Factory Pattern (' Abstract factory pattern ')
4. 'Singleton Pattern'
5. Builder Pattern (' Builder pattern ')
6. Prototype Pattern (' Prototype pattern ')

### 3.2 Structural type

Structural patterns describe how classes or pairs of objects can be combined to form larger structures, like building blocks that can be combined to form complex, more powerful structures. Structured patterns can be divided into class structured patterns and object structured patterns:

- The class structure pattern is concerned with the composition of classes. Multiple classes can be combined into a larger system. In the class structure pattern, there are generally only inheritance relations and implementation relations.

- The object structure pattern is concerned with the combination of classes and objects, allowing an instance object of one class to be defined in another class through association, and its methods to be invoked through that object. According to the principle of "synthetic reuse", the associative relation is used to replace the successor relation in the system as much as possible, so most of the structural patterns are object structural patterns.

1. Appearance mode
2. Adapter mode
3. Bridge mode
4. Proxy mode
5. Decorator mode
6. Enjoy meta mode

### 3.3 Behavioral patterns

Behavioral patterns are abstractions that divide responsibilities and algorithms between different objects. The behavioral pattern focuses not only on the structure of classes and objects, but also on the interactions between them. Behavioral patterns allow you to more clearly divide the responsibilities of classes and objects and study the interactions between instance objects at runtime.

1. Responsibility chain mode
2. Command mode
3. Interpreter mode
4. Iterator mode
5. Intermediary model
6. Memo mode
7. Observer mode
8. Status mode
9. Policy mode
10. Template Method mode
11. Visitor pattern

## Four, create type

### 4.1 Simple Factory mode

> Simple Factory Pattern: A single class (factory class) is defined to be responsible for creating instances of other classes. Instances of different classes can be returned based on the parameters of the creation method, and the created instances usually have a common parent class.

![](../../assets/article/designPattern/简单工厂.png)

**Example:**

The simple factory model is like a foundry, a factory can produce a variety of products. For example, a beverage processing plant helps produce both Pepsi and Coca-Cola, and the processing plant produces different products according to the input parameter 'Type'.

```ts
interface Cola {}

interface CocaCola extends Cola {}

interface PepsiCola extends Cola {}
```

```ts
// SimpleFactory
const createColaWithType = (type: number) => {
  switch (type) {
    case 0:
      return new CocaCola();
    case 1:
      return new PepsiCola();
    default:
      return null;
      break;
  }
};
```

```ts
const cocaCola: CocaCola = createColaWithType(0);

const pepsiCola: PepsiCola = createColaWithType(1);
```

**Advantages:**

- The user only needs to pass a correct agreed parameter to the factory class, and you can get the object you need, without knowing its creation details, to reduce the coupling of the system to a certain extent.
- The client does not need to know the class name of the specific product class created, only needs to know the parameters corresponding to the specific product class, reducing the memory cost of the developer.

**Disadvantage:**

- If new products are added to the business, it is necessary to modify the original judgment logic of the factory class, which is actually contrary to the principle of opening and closing.
- When there are many product types, the factory logic may be too complicated. Therefore, the simple factory model is more suitable for the situation where the product variety is relatively small and the probability of increasing is very low.

### 4.2 Factory Method mode

> Factory Method Pattern (' factory method pattern ') is also known as the factory pattern, the factory parent class is responsible for defining the public interface for creating product objects, and the factory subclass is responsible for generating concrete product objects, that is, through different factory subclasses to create different product objects.

![](../../assets/article/designPattern/工厂方法.png)

**Example:**

There are some differences between the factory method and the simple factory, the simple factory is the production of different products by a foundry, while the factory method is the abstraction of the factory, different products are produced by a specific factory. The Coca-Cola factory specializes in the production of Coca-Cola, and the Pepsi factory specializes in the production of Pepsi.

```ts
// Factory abstract class
class Cola {}

// The Coca-Cola Factory
class CocaCola extends Cola {}

// Pepsi Factory
class PepsiCola extends Cola {}
```

```ts
// Different products are produced according to different factory types
const cocaCola = new CocaCola();
const pepsiCola = new PepsiCola();
```

**Advantages:**

- Users only need to care about the specific factory corresponding to the product they need, do not need to care about the details of the creation of the product, do not need to know the class name of the specific product class.
- When a new product is added to the system, it is not necessary to modify the interface provided by the abstract factory and the abstract product, nor to modify the client and other specific factories and specific products, but only to add a specific factory and its corresponding specific products, in line with the open and close principle.

**Disadvantage:**

- When a new product is added to the system, in addition to the new product class, the corresponding specific factory class must be provided. Therefore, the number of classes in the system will be increased in pairs, increasing the complexity of the system.

### 4.3 Abstract factory pattern

The abstract factory pattern does not directly generate instances, but is used to create clusters of product classes.

> Abstract Factory Pattern: Provides an interface for creating a series of related or interdependent objects without specifying their concrete classes.

![](../../assets/article/designPattern/抽象工厂.png)

**Example:**

The difference between the abstract factory and the factory method is that the factory that produces the product is abstract. For example, when Coca-Cola produces Coke, it also needs to produce bottles and boxes for Coke. The bottles and boxes are also customized by Coca-Cola, and Pepsi will also have this demand. At this time, our factory is not only a factory that produces cola drinks, but also has to produce bottles and boxes with the same theme at the same time, so it is an abstract theme factory, specializing in the production of different goods with the same theme.

```ts
// Coke abstract classes and derived classes
class Cola {}

class CocaCola extends Cola {}

class PepsiCola extends Cola {}

// Bottle abstract and derived classes
class Bottle {}

class CocaColaBottle extends Bottle {}

class PepsiColaBottle extends Bottle {}

// Box abstract classes and derived classes
class Box {}

class CocaColaBox extends Box {}

class PepsiColaBox extends Box {}

// Factory abstract class
const Factory = {
  createCola: () => new Cola(),
  createBottle: () => new Bottle(),
  createBox: () => new Box(),
};

// Coca-Cola Theme Factory
const CocaColaFactory = {
  createCola: () => new CocaCola(),
  createBottle: () => new CocaColaBottle(),
  createBox: () => new CocaColaBox(),
};

// Pepsi Theme Factory
const PepsiColaFactory = {
  createCola: () => new PepsiCola(),
  createBottle: () => new PepsiColaBottle(),
  createBox: () => new PepsiColaBox(),
};
```

```ts
// Coca-Cola theme
const cocaCola = CocaColaFactory.createCola();
const cocaColaBottle = CocaColaFactory.createBottle();
const cocaColaBox = CocaColaFactory.createBox();

// Pepsi theme
const pepsiCola = PepsiColaFactory.createCola();
const pepsiColaBottle = PepsiColaFactory.createBottle();
const pepsiColaBox = PepsiColaFactory.createBox();
```

**Advantages:**

- Product specific code isolation at the application layer, do not need to care about product details. When multiple objects in a product family are designed to work together, it ensures that the client always uses only objects in the same product family. This is a very practical design pattern for software systems that need to determine their behavior based on the current environment.

**Disadvantage:**

- Specifies the set of all products that can be created, the difficulty of extending new products in the product family, and the need to modify the interface of the abstract factory.

### 4.4 Singleton pattern

> Singleton Pattern：The singleton pattern ensures that there is only one instance of a class and provides a full access point to it.

![](../../assets/article/designPattern/UML/创建型/单例.jpg)

**Example:**

In singleton mode, the corresponding class can generate only one instance. Just as a kingdom can only have one king, once the affairs of the kingdom are too many, this only king is easy to take on too much responsibility.

```ts
class Singleton {}

function createSingleton() {
  let instance;
  return function () {
    if (!instance) return new Singleton();
    return instance;
  };
}
```

**Advantages:**

- Provides controlled access to unique instances. Because a singleton encapsulates its unique instance, it has tight control over how and when customers access it.
- This class saves system resources because it has only one object in system memory.

**Disadvantage:**

Since there is no abstraction layer in the singleton pattern, singleton classes are difficult to extend.
- For languages that have garbage collection systems, such as Java and C#, objects may be recycled if they are not utilized for a long time. If the singleton holds some data, it will no longer exist when it is reinstantiated after collection.

### 4.5 Builder Pattern

> Builder Pattern：Also known as the creator pattern, it separates the construction of a complex object from its representation, allowing the same construction process to create different representations.

The factory pattern is mainly for the creation of object instances or class clusters (abstract factories), concerned with the final output (creation) is what, not concerned with the creation process. The builder pattern is concerned with the entire process of creating the object, down to every detail of creating the object.

![](../../assets/article/designPattern/建造者.jpeg)

**Example:**

The main roles of the generator mode are as follows:

1. Generator: The product construction steps common to all types of generators in the interface life
2. Concrete generator: Provides different implementations of the construction process. Concrete generators can also construct products that do not follow a generic interface
3. Product: is the final generated object. Products constructed from different generators need not belong to the same class of hierarchical constructs or interfaces
4. Conductor: Define the order in which construction steps are called so that you can create and consume specific product configurations
5. Client side: You must associate a generator object with a supervisor class. In general, you only need to do a one-time association through the parameters of the supervisor class constructor

```ts
// Abstract Builder
abstract class Builder {
  public abstract buildPartA(): void;
  public abstract buildPartB(): void;
  public abstract buildPartC(): void;
  public abstract buildProduct(): Product;
}

// Concrete builder
class ConcreteBuilder extends Builder {
  private product: Product;
  constructor(product: Product) {
    super();
    this.product = product;
  }

  public buildPartA(): void {}
  public buildPartB(): void {}
  public buildPartC(): void {}

  // Finally build a product
  public buildProduct(): Product {
    return this.product;
  }
}

// Product role
class Product {
  public doSomething(): void {
    // Independent business
  }
}

// director
class Director {
  private _builder: Builder;
  constructor(builder: Builder) {
    this._builder = builder;
  }

  set builder(builder: Builder) {
    this._builder = builder;
  }

  // Leave the process of handling the construction to the commander
  public constructorProduct() {
    this._builder.buildPartA();
    this._builder.buildPartB();
    this._builder.buildPartC();
    return this._builder.buildProduct();
  }
}

// Use
const builder: Builder = new ConcreteBuilder(new Product());
const director: Director = new Director(builder);
const product: Product = director.constructorProduct();
```

**Advantages:**

- The client does not have to know the details of the internal composition of the product, decoupling the product itself from the product creation process, so that the same creation process can create different product objects.
- Each concrete builder is relatively independent, and has nothing to do with other concrete builders, so it is easy to replace concrete builders or add new concrete builders, and users can get different product objects using different concrete builders.
- Adding new concrete builders does not need to modify the code of the original class library, the command class is programmed for the abstract builder class, the system is easy to expand, and conforms to the "open and close principle".
- The product creation process can be more finely controlled. Breaking down the creation steps of complex products into different methods makes the creation process clearer and easier to use programs to control the creation process.

**Disadvantage:**

- The products created by the builder mode generally have more in common and their components are similar. If the differences between products are large, the builder mode is not suitable for use, so its scope of use is limited.
If the internal changes of the product are complex, it may lead to the need to define many concrete constructor classes to achieve such changes, resulting in a large system, increasing the difficulty of understanding the system and the cost of operation.

### 4.6 Prototype Pattern

> Prototype Pattern: A prototype instance points to the class that created the object, and uses the properties and methods of the shared prototype used by the class that created the new object.

![](../../assets/article/designPattern/UML/创建型/原型.jpg)

**Example:**

Prototype mode is like photocopying technology, copy a new object from the original object, and fine-tune the new object according to the needs.

```ts
// Because it's not a constructor, you don't use capitalization
const car = {
  drive: function () {},
  name: '马自达 3',
};

// Create a new car x using Object.create
const anotherCar = Object.create(someCar);
anotherCar.name = '丰田佳美';
```

```ts
const vehiclePrototype = {
  init: function (carModel) {
    this.model = carModel;
  },
  getModel: function () {
    console.log('车辆模具是：' + this.model);
  },
};

function vehicle(model) {
  function F() {}
  F.prototype = vehiclePrototype;

  const f = new F();

  f.init(model);
  return f;
}

const car = vehicle('福特Escort');
car.getModel();
```

**Advantages:**

- The prototype mode can be used to simplify the object creation process, especially for some objects with complicated creation process and many object levels, the prototype mode can save system resources and improve the efficiency of object generation.
- It is easy to generate new objects by changing the values: some objects may differ only from one another in certain values; Using prototype mode, you can quickly copy new objects and manually modify the values.

**Disadvantage:**

- All objects contained in an object need to be equipped with a clone method, which makes the amount of code in the case of more object levels will be large and more complex.

## Five, structural type

### 5.1 Decorative pattern

> Decorator Pattern：The design pattern that adds new functionality to an existing object without changing its structure is called the decorator pattern, which acts as a wrapper around an existing class.

You can think of decorators as equipment purchased by game characters, such as heroes in LOL who start the game with only basic attack power and mana. However, after the purchase of equipment, you can enjoy the output bonus brought by the equipment when triggering attacks and skills. We can understand the purchase of equipment to give the hero's attack and skill related methods decorated.

![](../../assets/article/designPattern/装饰.jpg)

**Example:**

The decorative mode conforms to the open-close principle and transforms or adds new functions to the parent class without changing the original class.

decoration

```ts
@annotation
class MyClass {}

function annotation(target) {
  target.annotated = true;
}
```

Decorative method or attribute

```js
class MyClass {
  @readonly
  method() {}
}

function readonly(target, name, descriptor) {
  descriptor.writable = false;
  return descriptor;
}
```

**Advantages:**

- More flexible than inheritance: unlike inheritance, which works at compile time; Decorator mode can extend the functionality of an object at run time. It is also possible to select different decorators at run time through configuration files to achieve different behavior. It can also achieve different effects through different combinations.
- Comply with the "open and close principle" : the decorator and the decorator can vary independently. Users can add new decorative classes as needed, and then combine them when they are used, without changing the original code.

**Disadvantage:**

- Decorator mode requires the creation of some concrete decorator classes, which increases the complexity of the system.

### 5.2 外观模式

> Facade Pattern：A facade pattern defines a high-level interface that provides a unified interface for a set of interfaces in a subsystem. It makes the subsystem easier to use, not only simplifying the interfaces in the class, but also decoupling the caller from the interface. Appearance mode, also known as facade mode, is a structural design mode.

![](../../assets/article/designPattern/外观.png)

**Example:**

Appearance patterns provide a simple and unambiguous interface, but integrate many subsystem functions internally. Just like the image cache, which contains processing involving other subsystems such as caching, downloading, etc., the appearance pattern hides the complex logic. In the compatible browser event binding, you only need to call an 'addMyEvent' interface can be, to achieve the purpose of decoupling.

```js
const addMyEvent = function (el, ev, fn) {
  if (el.addEventListener) {
    el.addEventListener(ev, fn, false);
  } else if (el.attachEvent) {
    el.attachEvent('on' + ev, fn);
  } else {
    el['on' + ev] = fn;
  }
};
```

**Advantages:**

- Decoupling between the client and the subsystem is realized: the client does not need to know the interface of the subsystem, simplifying the process of the client calling the subsystem, making the subsystem easier to use. At the same time, it is easy to expand and maintain the subsystem.
- Demeter's law (least know principle) : The subsystem only needs to expose the interface that needs external calls to the appearance class, and its interface can be hidden.

**Disadvantage:**

- Violates the open-close principle: Adding a new subsystem without introducing abstract facade classes may require changes to facade classes or client code.

### 5.3 代理模式

> Proxy Pattern：Provide a proxy for an object, and this proxy object controls access to the original object.

![](../../assets/article/designPattern/代理.png)

**Example:**

The agent model is like a housing agent, the buyer can only buy a house through the intermediary, the agent has all the functions of the agent, just as the landlord has the function of selling the house, the intermediary also has the function of selling the house. In addition, the agent instance can also help the agent to carry out some additional processing, such as the function of the intermediary to help the landlord screen quality buyers, and help the landlord pass some unqualified buyers. The same pattern applies to message queues.

Reference 'koa' in the proxy mode, the 'response' on some properties and methods proxy out, easy to use

```js
/**
 * Response delegation.
 */
const delegate = require('delegates');

const prototype = (module.exports = {});

delegate(prototype, 'response')
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('has')
  .method('set')
  .method('append')
  .method('flushHeaders')
  .access('status')
  .access('message')
  .access('body')
  .access('length')
  .access('type')
  .access('lastModified')
  .access('etag')
  .getter('headerSent')
  .getter('writable');
```

Make a proxy for 'context', 'request', 'response', protecting the real 'context', 'request', 'response'

```js
this.context = Object.create(context);
this.request = Object.create(request);
this.response = Object.create(response);
```

**Advantages:**

- Reduce the coupling degree of the system: The proxy mode can coordinate the caller and the called, which reduces the coupling degree of the system to a certain extent.
- Different types of proxies can have different controls on the client's access to the target object:
- A remote agent that allows the client to access objects on a remote machine that may have better computational performance and processing speed and can respond and process client requests quickly.
By using a small object to represent a large object, virtual agents can reduce the consumption of system resources, optimize the system, and increase the speed of operation.
- The protection agent can control the client's permission to use real objects.

**Disadvantage:**

- Adding a proxy object between the client and the proxy object may slow down client requests.

### 5.4 Flyweight Pattern

> Flyweight Pattern：The meta mode is a mode that optimizes program performance, essentially reducing the number of objects created. Using sharing technology to reuse a large number of fine-grained objects, reduce the program memory occupation, improve the performance of the program. Share metamode can be used when there are a large number of similar objects that occupy a large amount of memory. Most of the state in an object can be extrapolated to external state.

![](../../assets/article/designPattern/享元.png)

**Example:**

For example, a music service can be divided into free users and member users based on fees. Free users can only listen to some free music, and member users can listen to all music and can download it. Although there are some differences in permissions between the two, the music they enjoy is from the same library, so all the music needs to be saved only one copy. In addition, if there is no music in the music library, you need to add the music, and then other services can also enjoy the new music, which is equivalent to the function of the share pool or cache pool.

The share mode area ensures that the internal state is shared, such as the music library, while the external state is customized according to different needs, such as various access rights, and the internal state cannot be changed during use to achieve the purpose of sharing.

```ts
// Music service
const MusicService = {}

// Shared music library
const musicLibrary = {};

// Listen to music
const listenToMusic = (music) => {
    ...
}
// Download music
const downloadMusic = (music) => {
    ...
}


// Free music service
const FreeMusicService = {
    listenFreeMusic: (music)=>{
        if(isMusicFree(music)){
            // If it is free, play it
            listenToMusic()
        }else{
    	    // If it is paid music, the user is prompted to upgrade the Vip Vip
            console.log("please upgrade to Vip")
        }
    }
}


// Vip Music Service
const VipMusicService = {
    // You can listen to all the music
    listenMusic
    // You can download music
    downloadMusic
}
```

**Advantages:**

- The use of the share module can reduce the number of objects in memory, so that the same object or similar objects in memory only one copy, reduce the system memory usage, can also improve performance.
- The external state of the share meta pattern is relatively independent and does not affect its internal state, so that share meta objects can be shared in different environments.

**Disadvantage:**

- Using the meta pattern requires the separation of internal and external states, which complicates the logic of the program.
- Object reuse in buffer pools requires consideration of threading issues.

### 5.5 桥接模式

> 桥接模式(`Simple Factory Pattern`)：将抽象部分与它的实现部分分离,使它们都可以独立地变化。

![](../../assets/article/designPattern/桥接.png)

**举例：**

球和人都可以进行运动，但球有运动和颜色，人可以运动和说话。对共同部分进行抽象。

```js
class Speed {
  // 运动模块
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  run() {
    console.log(`运动起来 ${this.x} + ${this.y}`);
  }
}

class Color {
  // 着色模块
  constructor(cl) {
    this.color = cl;
  }
  draw() {
    console.log(`绘制颜色 ${this.color}`);
  }
}

class Speak {
  constructor(wd) {
    this.word = wd;
  }
  say() {
    console.log(`说话 ${this.word}`);
  }
}

class Ball {
  // 创建球类，可以着色和运动
  constructor(x, y, cl) {
    this.speed = new Speed(x, y);
    this.color = new Color(cl);
  }
  init() {
    this.speed.run();
    this.color.draw();
  }
}

class Man {
  // 人类，可以运动和说话
  constructor(x, y, wd) {
    this.speed = new Speed(x, y);
    this.speak = new Speak(wd);
  }
  init() {
    this.speed.run();
    this.speak.say();
  }
}

const man = new Man(1, 2, 'hello ?');
man.init(); // 运动起来 1 + 2      说话 hello?
```

**优点：**

- 扩展性好，符合开闭原则：将抽象与实现分离，让二者可以独立变化

**缺点：**

- 在设计之前，需要识别出两个独立变化的维度。

### 5.6 适配器模式

> 适配器模式(`Adapter Pattern`) ：适配器模式是用来解决两个接口不兼容的情况，不需要改变已有的接口，通过包装一层的方式，实现两个接口正常协作。当我们试图调用模块或者对象的某个接口时，却发现这个接口的格式并不符合目前的需求, 则可以用适配器模式。

![](../../assets/article/designPattern/适配器.png)

**举例：**

事件绑定兼容各浏览器

```js
function addEvent(ele, event, callback) {
    if (ele.addEventListener) {
      ele.addEventListener(event, callback)
    } else if(ele.attachEvent) {
      ele.attachEvent('on' + event, callback)
    } else {
      ele['on' + event] = callback
    }
  }
​
```

**优点：**

- 符合开闭原则：使用适配器而不需要改变现有类，提高类的复用性。
- 目标类和适配器类解耦，提高程序扩展性。

**缺点：**

- 增加了系统的复杂性

## 六、行为型

### 6.1 职责链模式

> 职责链模式(Chain of Responsibility Pattern)：避免请求发送者与接收者耦合在一起，让多个对象都有可能接收请求，将这些对象连接成一条链，并且沿着这条链传递请求，直到有对象处理它为止。职责链模式是一种对象行为型模式。 类似多米诺骨牌, 通过请求第一个条件, 会持续执行后续的条件, 直到返回结果为止。

![](../../assets/article/designPattern/责任链.png)

**举例：**

场景: 某电商针对已付过定金的用户有优惠政策, 在正式购买后, 已经支付过 500 元定金的用户会收到 100 元的优惠券, 200 元定金的用户可以收到 50 元优惠券, 没有支付过定金的用户只能正常购买。

```js
const order500 = function (orderType, pay, stock) {
  if (orderType === 1 && pay == true) {
    console.log('500元定金预购，得到100元优惠劵');
  } else {
    return 'nextSuccess';
  }
};
const order200 = function (orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('200元定金预购，得到50元優惠卷');
  } else {
    return 'nextSuccess';
  }
};
const orderCommon = function (orderType, pay, stock) {
  if (orderType == 3 && stock > 0) {
    console.log('普通購買，无優惠卷');
  } else {
    console.log('库存不够');
  }
};
//链路代码
const chain = function (fn) {
  this.fn = fn;
  this.successor = null;
};
chain.prototype.setNext = function (successor) {
  this.successor = successor;
};
chain.prototype.init = function () {
  const result = this.fn.apply(this, arguments);
  if (result == 'nextSuccess') {
    this.successor.init.apply(this.successor, arguments);
  }
};
const order500New = new chain(order500);
const order200New = new chain(order200);
const orderCommonNew = new chain(orderCommon);
order500New.setNext(order200New);
order200New.setNext(orderCommonNew);
order500New.init(3, true, 500); // 普通购买, 无优惠券
```

**优点：**

- 职责链模式使得一个对象无须知道是其他哪一个对象处理其请求，对象仅需知道该请求会被处理即可，接收者和发送者都没有对方的明确信息，且链中的对象不需要知道链的结构，由客户端负责链的创建，降低了系统的耦合度。
- 请求处理对象仅需维持一个指向其后继者的引用，而不需要维持它对所有的候选处理者的引用，可简化对象的相互连接。
- 在给对象分派职责时，职责链可以给我们更多的灵活性，可以通过在运行时对该链进行动态的增加或修改来增加或改变处理一个请求的职责。
- 在系统中增加一个新的具体请求处理者时无须修改原有系统的代码，只需要在客户端重新建链即可，从这一点来看是符合“开闭原则”的。

**缺点：**

- 由于一个请求没有明确的接收者，那么就不能保证它一定会被处理，该请求可能一直到链的末端都得不到处理；一个请求也可能因职责链没有被正确配置而得不到处理。
- 对于比较长的职责链，请求的处理可能涉及到多个处理对象，系统性能将受到一定影响，而且在进行代码调试时不太方便。
- 如果建链不当，可能会造成循环调用，将导致系统陷入死循环。

### 6.2 命令模式

> 命令模式(`Command Pattern`)：将一个请求封装为一个对象，从而让我们可用不同的请求对客户进行参数化；命令模式是一种对象行为型模式，其别名为动作(`Action`)模式或事务(`Transaction`)模式。

命令模式由三种角色构成：

1. 发布者 `invoker`（发出命令，调用命令对象，不知道如何执行与谁执行）；
2. 接收者 `receiver` (提供对应接口处理请求，不知道谁发起请求）；
3. 命令对象 `command`（接收命令，调用接收者对应接口处理发布者的请求）。
   发布者 invoker 和接收者 receiver 各自独立，将请求封装成命令对象 command ，请求的具体执行由命令对象 command 调用接收者 receiver 对应接口执行。

![](../../assets/article/designPattern/命令.png)

**举例：**

和之前代理模式中的举例有些相似，不过命令模式的本质是对命令进行封装，将发出命令的责任和执行命令的责任分割开。例如遥控器是一个调用者，不同按钮代表不同的命令，而电视是接收者。

```js
class Receiver {
  // 接收者类
  execute() {
    console.log('接收者执行请求');
  }
}

class Command {
  // 命令对象类
  constructor(receiver) {
    this.receiver = receiver;
  }
  execute() {
    // 调用接收者对应接口执行
    console.log('命令对象->接收者->对应接口执行');
    this.receiver.execute();
  }
}

class Invoker {
  // 发布者类
  constructor(command) {
    this.command = command;
  }
  invoke() {
    // 发布请求，调用命令对象
    console.log('发布者发布请求');
    this.command.execute();
  }
}

const warehouse = new Receiver(); // 仓库
const order = new Command(warehouse); // 订单
const client = new Invoker(order); // 客户
client.invoke();
```

**优点：**

- 降低系统的耦合度。由于请求者与接收者之间不存在直接引用，因此请求者与接收者之间实现完全解耦，相同的请求者可以对应不同的接收者，同样，相同的接收者也可以供不同的请求者使用，两者之间具有良好的独立性。
- 新的命令可以很容易地加入到系统中。由于增加新的具体命令类不会影响到其他类，因此增加新的具体命令类很容易，无须修改原有系统源代码，甚至客户类代码，满足“开闭原则”的要求。
- 可以比较容易地设计一个命令队列或宏命令（组合命令）。
- 为请求的撤销(Undo)和恢复(Redo)操作提供了一种设计和实现方案。

**缺点：**

- 使用命令模式可能会导致某些系统有过多的具体命令类。因为针对每一个对请求接收者的调用操作都需要设计一个具体命令类，因此在某些系统中可能需要提供大量的具体命令类，这将影响命令模式的使用。

### 6.3 解释器模式

> 解释器模式(`Interpreter Pattern`)：定义一个语言的文法，并且建立一个解释器来解释该语言中的句子，这里的“语言”是指使用规定格式和语法的代码。解释器模式是一种类行为型模式。

![](../../assets/article/designPattern/解释器.jpg)

**举例：**

给定一个语言, 定义它的文法的一种表示，并定义一个解释器, 该解释器使用该表示来解释语言中的句子。

```js
class Context {
  constructor() {
    this._list = []; // 存放 终结符表达式
    this._sum = 0; // 存放 非终结符表达式(运算结果)
  }

  get sum() {
    return this._sum;
  }
  set sum(newValue) {
    this._sum = newValue;
  }
  add(expression) {
    this._list.push(expression);
  }
  get list() {
    return [...this._list];
  }
}

class PlusExpression {
  interpret(context) {
    if (!(context instanceof Context)) {
      throw new Error('TypeError');
    }
    context.sum = ++context.sum;
  }
}
class MinusExpression {
  interpret(context) {
    if (!(context instanceof Context)) {
      throw new Error('TypeError');
    }
    context.sum = --context.sum;
  }
}

/** 以下是测试代码 **/
const context = new Context();

// 依次添加: 加法 | 加法 | 减法 表达式
context.add(new PlusExpression());
context.add(new PlusExpression());
context.add(new MinusExpression());

// 依次执行: 加法 | 加法 | 减法 表达式
context.list.forEach((expression) => expression.interpret(context));
console.log(context.sum);
```

**优点：**

- 易于改变和扩展文法。由于在解释器模式中使用类来表示语言的文法规则，因此可以通过继承等机制来改变或扩展文法。
- 每一条文法规则都可以表示为一个类，因此可以方便地实现一个简单的语言。
- 实现文法较为容易。在抽象语法树中每一个表达式节点类的实现方式都是相似的，这些类的代码编写都不会特别复杂，还可以通过一些工具自动生成节点类代码。
- 增加新的解释表达式较为方便。如果用户需要增加新的解释表达式只需要对应增加一个新的终结符表达式或非终结符表达式类，原有表达式类代码无须修改，符合“开闭原则”。

**缺点：**

- 对于复杂文法难以维护。在解释器模式中，每一条规则至少需要定义一个类，因此如果一个语言包含太多文法规则，类的个数将会急剧增加，导致系统难以管理和维护，此时可以考虑使用语法分析程序等方式来取代解释器模式。
- 执行效率较低。由于在解释器模式中使用了大量的循环和递归调用，因此在解释较为复杂的句子时其速度很慢，而且代码的调试过程也比较麻烦。

### 6.4 迭代器模式

> 迭代器模式(`Iterator Pattern`)：一个相对简单的模式，目前绝大多数语言都内置了迭代器，以至于大家都不觉得这是一种设计模式。迭代器并不只迭代数组，迭代器可以中止。提供一种方法来访问聚合对象，而不用暴露这个对象的内部表示，其别名为游标(`Cursor`)。迭代器模式是一种对象行为型模式。

![](../../assets/article/designPattern/迭代器.png)

**举例：**

迭代器帮助请求方获取数据，避免直接操作数据聚合类，使数据聚合类专注存储数据。具体应用有分页等功能，分页功能的迭代器将专门负责操作分页数据，将操作逻辑和数据源分离。

```js
var each = function (arr, callback) {
  for (var i = 0, len = arr.length; i < len; i++) {
    callback.call(arr[i], i, arr[i]);
  }
};

each([1, 2, 3, 4, 5], function (i, el) {
  console.log('index: ', i);
  console.log('item: ', el);
});
```

**优点：**

- 它支持以不同的方式遍历一个聚合对象，在同一个聚合对象上可以定义多种遍历方式。在迭代器模式中只需要用一个不同的迭代器来替换原有迭代器即可改变遍历算法，我们也可以自己定义迭代器的子类以支持新的遍历方式。
- 迭代器简化了聚合类。由于引入了迭代器，在原有的聚合对象中不需要再自行提供数据遍历等方法，这样可以简化聚合类的设计。
- 在迭代器模式中，由于引入了抽象层，增加新的聚合类和迭代器类都很方便，无须修改原有代码，满足“开闭原则”的要求。

**缺点：**

- 由于迭代器模式将存储数据和遍历数据的职责分离，增加新的聚合类需要对应增加新的迭代器类，类的个数成对增加，这在一定程度上增加了系统的复杂性。
- 抽象迭代器的设计难度较大，需要充分考虑到系统将来的扩展，例如 JDK 内置迭代器 Iterator 就无法实现逆向遍历，如果需要实现逆向遍历，只能通过其子类 ListIterator 等来实现，而 ListIterator 迭代器无法用于操作 Set 类型的聚合对象。在自定义迭代器时，创建一个考虑全面的抽象迭代器并不是件很容易的事情。

### 6.5 中介者模式

> 中介者模式`(Mediator Pattern`)：对象和对象之间借助第三方中介者进行通信。用一个中介对象（中介者）来封装一系列的对象交互，中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。中介者模式又称为调停者模式，它是一种对象行为型模式。

![](../../assets/article/designPattern/中介者.png)

**举例：**

中介者模式将一个网状的系统结构变成一个以中介者对象为中心的星形结构，在这个星型结构中，使用中介者对象与其他对象的一对多关系来取代原有对象之间的多对多关系。所有成员通过中介者交互，方便拓展新的成员，例如下面的例子，一场测试结束后, 公布结果: 告知解答出题目的人挑战成功, 否则挑战失败。在这段代码中 A、B、C 之间没有直接发生关系, 而是通过另外的 playerMiddle 对象建立链接, 姑且将之当成是中介者模式了。

```js
const player = function (name) {
  this.name = name;
  playerMiddle.add(name);
};
player.prototype.win = function () {
  playerMiddle.win(this.name);
};
player.prototype.lose = function () {
  playerMiddle.lose(this.name);
};
const playerMiddle = (function () {
  //将就用下这个demo, 这个函数充当中介者
  const players = [];
  const winArr = [];
  const loseArr = [];
  return {
    add: function (name) {
      players.push(name);
    },
    win: function (name) {
      winArr.push(name);
      if (winArr.length + loseArr.length === players.length) {
        this.show();
      }
    },
    lose: function (name) {
      loseArr.push(name);
      if (winArr.length + loseArr.length === players.length) {
        this.show();
      }
    },
    show: function () {
      for (let winner of winArr) {
        console.log(winner + '挑戰成功;');
      }
      for (let loser of loseArr) {
        console.log(loser + '挑战失败;');
      }
    },
  };
})();
const a = new player('A选手');
const b = new player('B选手');
const c = new player('C选手');
a.win();
b.lose();
c.win();
// A 选手挑战成功;
// B 选手挑战成功;
// C 选手挑战失败;
```

**优点：**

- 中介者模式简化了对象之间的交互，它用中介者和同事的一对多交互代替了原来同事之间的多对多交互，一对多关系更容易理解、维护和扩展，将原本难以理解的网状结构转换成相对简单的星型结构。
- 中介者模式可将各同事对象解耦。中介者有利于各同事之间的松耦合，我们可以独立的改变和复用每一个同事和中介者，增加新的中介者和新的同事类都比较方便，更好地符合“开闭原则”。
- 可以减少子类生成，中介者将原本分布于多个对象间的行为集中在一起，改变这些行为只需生成新的中介者子类即可，这使各个同事类可被重用，无须对同事类进行扩展。

**缺点：**

- 在具体中介者类中包含了大量同事之间的交互细节，可能会导致具体中介者类非常复杂，使得系统难以维护。

### 6.6 备忘录模式

> 备忘录模式(`Memento Pattern`)：在不破坏封装的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，以便日后对象使用或者对象恢复到以前的某个状态。它是一种对象行为型模式，其别名为 Token。

![](../../assets/article/designPattern/UML/行为型/备忘录.jpg)
**举例：**

备忘录模式提供了一种状态恢复的实现机制，使得用户可以方便地回到一个特定的历史步骤，当新的状态无效或者存在问题时，可以使用暂时存储起来的备忘录将状态复原，当前很多软件都提供了撤销操作，其中就使用了备忘录模式。

当我们开发一个分页组件的时候，点击下一页获取新的数据，但是当点击上一页时，又重新获取数据，造成无谓的流量浪费，这时可以对数据进行缓存。

```js
// 备忘录模式伪代码
var Page = function () {
  // 通过cache对象缓存数据
  var cache = {};
  return function (page, fn) {
    if (cache[page]) {
      showPage(page, cache[page]);
    } else {
      $.post('/url', function (data) {
        showPage(page, data);
        cache[page] = data;
      });
    }
    fn && fn();
  };
};
```

**优点：**

- 它提供了一种状态恢复的实现机制，使得用户可以方便地回到一个特定的历史步骤，当新的状态无效或者存在问题时，可以使用暂时存储起来的备忘录将状态复原。
- 备忘录实现了对信息的封装，一个备忘录对象是一种原发器对象状态的表示，不会被其他代码所改动。备忘录保存了原发器的状态，采用列表、堆栈等集合来存储备忘录对象可以实现多次撤销操作。

**缺点：**

- 资源消耗过大，如果需要保存的原发器类的成员变量太多，就不可避免需要占用大量的存储空间，每保存一次对象的状态都需要消耗一定的系统资源。

### 6.7 观察者模式

> 观察者模式(`Observer Pattern)`：定义对象之间的一种一对多依赖关系，使得每当一个对象状态发生改变时，其相关依赖对象皆得到通知并被自动更新。观察者模式的别名包括发布-订阅（`Publish/Subscribe`）模式、模型-视图（`Model/View`）模式、源-监听器（`Source/Listener`）模式或从属者（`Dependents`）模式。观察者模式是一种对象行为型模式。

![](../../assets/article/designPattern/观察者.png)

**举例：**

观察者模式是使用频率最高的设计模式之一，它用于建立一种对象与对象之间的依赖关系，一个对象发生改变时将自动通知其他对象，其他对象将相应作出反应。

在`JavaScript`中观察者模式的实现主要用事件模型，`DOM`事件。

```js
// 发布者
var pub = function () {
  console.log('欢迎订阅!');
};
// 订阅者
var sub = document.body;

// 订阅者实现订阅
sub.addEventListener('click', pub, false);
```

**优点：**

- 观察者模式可以实现表示层和数据逻辑层的分离，定义了稳定的消息更新传递机制，并抽象了更新接口，使得可以有各种各样不同的表示层充当具体观察者角色。
- 观察者模式在观察目标和观察者之间建立一个抽象的耦合。观察目标只需要维持一个抽象观察者的集合，无须了解其具体观察者。由于观察目标和观察者没有紧密地耦合在一起，因此它们可以属于不同的抽象化层次。
- 观察者模式支持广播通信，观察目标会向所有已注册的观察者对象发送通知，简化了一对多系统设计的难度。
- 观察者模式满足“开闭原则”的要求，增加新的具体观察者无须修改原有系统代码，在具体观察者与观察目标之间不存在关联关系的情况下，增加新的观察目标也很方便。

**缺点：**

- 如果一个观察目标对象有很多直接和间接观察者，将所有的观察者都通知到会花费很多时间。
- 如果在观察者和观察目标之间存在循环依赖，观察目标会触发它们之间进行循环调用，可能导致系统崩溃。
- 观察者模式没有相应的机制让观察者知道所观察的目标对象是怎么发生变化的，而仅仅只是知道观察目标发生了变化。

### 6.8 状态模式

> 状态模式(`State Pattern`)：允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。其别名为状态对象(`Objects for States`)，其实就是用一个对象或者数组记录一组状态，每个状态对应一个实现，实现的时候根据状态挨个去运行实现。状态模式是一种对象行为型模式。

![](../../assets/article/designPattern/状态.png)

**举例：**

状态模式用于解决复杂对象的状态转换以及不同状态下行为的封装问题。当系统中某个对象存在多个状态，这些状态之间可以进行转换，所以对象在不同状态下具有不同行为时可以使用状态模式。状态模式将一个对象的状态从该对象中分离出来，封装到专门的状态类中，使得对象状态可以灵活变化。

比如超级玛丽，就可能同时有好几个状态比如 跳跃，移动，射击，蹲下 等，如果对这些动作一个个进行处理判断，需要多个 if-else 或者 switch 不仅丑陋不说，而且在遇到有组合动作的时候，实现就会变的更为复杂，这里可以使用状态模式来实现。

状态模式的思路是：首先创建一个状态对象或者数组，内部保存状态变量，然后内部封装好每种动作对应的状态，然后状态对象返回一个接口对象，它可以对内部的状态修改或者调用。

```js
class SuperMarry {
  constructor() {
    this._currentState = [];
    this.states = {
      jump() {
        console.log('跳跃!');
      },
      move() {
        console.log('移动!');
      },
      shoot() {
        console.log('射击!');
      },
      squat() {
        console.log('蹲下!');
      },
    };
  }

  change(arr) {
    // 更改当前动作
    this._currentState = arr;
    return this;
  }

  go() {
    console.log('触发动作');
    this._currentState.forEach((T) => this.states[T] && this.states[T]());
    return this;
  }
}

new SuperMarry()
  .change(['jump', 'shoot'])
  .go() // 触发动作  跳跃!  射击!
  .go() // 触发动作  跳跃!  射击!
  .change(['squat'])
  .go(); // 触发动作  蹲下!
```

**优点：**

- 封装了状态的转换规则，在状态模式中可以将状态的转换代码封装在环境类或者具体状态类中，可以对状态转换代码进行集中管理，而不是分散在一个个业务方法中。
- 将所有与某个状态有关的行为放到一个类中，只需要注入一个不同的状态对象即可使环境对象拥有不同的行为。
- 允许状态转换逻辑与状态对象合成一体，而不是提供一个巨大的条件语句块，状态模式可以让我们避免使用庞大的条件语句来将业务方法和状态转换代码交织在一起。
- 可以让多个环境对象共享一个状态对象，从而减少系统中对象的个数。

**缺点：**

- 状态模式的使用必然会增加系统中类和对象的个数，导致系统运行开销增大。
- 状态模式的结构与实现都较为复杂，如果使用不当将导致程序结构和代码的混乱，增加系统设计的难度。
- 状态模式对“开闭原则”的支持并不太好，增加新的状态类需要修改那些负责状态转换的源代码，否则无法转换到新增状态；而且修改某个状态类的行为也需修改对应类的源代码。

### 6.9 策略模式

> 策略模式(`Strategy Pattern`)：定义一些列算法，把他们封装起来，并且可以相互替换。就是把看似毫无联系的代码提取封装、复用，使之更容易被理解和拓展。常见的用于一次 if 判断、switch 枚举、数据字典等流程判断语句中。也称为政策模式(`Policy`)。策略模式是一种对象行为型模式。

![](../../assets/article/designPattern/策略.png)

**举例：**

使用策略模式时，我们可以定义一些策略类，每一个策略类中封装一种具体的算法。在这里，每一个封装算法的类我们都可以称之为一种策略，根据传入不同的策略类，使环境类执行不同策略类中的算法。

在游戏中，我们每玩完一局游戏都有对用户进行等级评价，比如 S 级 4 倍经验，A 级 3 倍经验，B 级 2 倍经验，其他 1 倍经验，用函数来表达如下：

```js
// 改为策略模式 分成两个函数来写
const strategy = {
  S: function (experience) {
    return 4 * experience;
  },
  A: function (experience) {
    return 3 * experience;
  },
  B: function (experience) {
    return 2 * experience;
  },
};
// getExperience可以复用
function getExperience(strategy, level, experience) {
  return level in strategy ? strategy[level](experience) : experience;
}
var s = getExperience(strategy, 'S', 100);
var a = getExperience(strategy, 'A', 100);
console.log(s, a); // 400 300
```

```js
// Instruction processing set
var compileUtil = {
    // v-text Works for updating views
    text: function(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },
    // v-html update view principle
    html: function(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },
    // v-class binding principle
    class: function(node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },
    bind: function(node, vm, exp, dir) {
        // The same instruction triggers the view update
        var updaterFn = updater[dir + 'Updater'];
        updaterFn && updaterFn(node, this._getVMVal(vm, exp));
        new Watcher(vm, exp, function(value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        });
    }
    ......
}
```

**Advantages:**

- Policy mode provides perfect support for the "open and close principle", users can choose algorithms or behaviors without modifying the original system, and can flexibly add new algorithms or behaviors.
- The policy pattern provides a way to manage related algorithm families. The hierarchy of a policy class defines an algorithm or family of behaviors, and proper use of inheritance can move common code into an abstract policy class, thereby avoiding duplicate code.
The policy pattern provides a way to replace inheritance relationships. Without the policy pattern, an environment class that uses algorithms might have several subclasses, each of which provides a different algorithm. However, in this way, the use of the algorithm is mixed with the algorithm itself, which does not conform to the "single responsibility principle", and the logic of deciding which algorithm to use is mixed with the algorithm itself, so that it is impossible to evolve independently. And using inheritance can not realize the dynamic switching of algorithms or behaviors during program running.
- Use policy mode to avoid multiple conditional selection statements. Multiple conditional selection statement is not easy to maintain, it takes the logic of which algorithm or behavior to take and the implementation logic of the algorithm or behavior itself mixed together, Hard Coding them all in a huge multiple conditional selection statement, than the direct inheritance of the environment class method is more primitive and backward.
- The policy pattern provides an algorithm reuse mechanism. Since algorithms are extracted separately and encapsulated in policy classes, different environment classes can reuse these policy classes easily.

**Disadvantage:**

- The client must know all the policy classes and decide which one to use. This means that the client must understand the difference between these algorithms in order to choose the right one at the right time. In other words, the policy pattern only applies if the client knows all the algorithms or behaviors.
- The policy mode will cause the system to generate many specific policy classes, and any small change will cause the system to add a new specific policy class.
- Multiple policy classes cannot be used on the client at the same time. That is, when the policy mode is used, the client can use only one policy class at a time. One policy class cannot be used to complete some functions and then another policy class is used to complete the remaining functions.

### 6.10 Template method pattern

> Template method pattern ：Define the framework of an algorithm in an operation, while deferring some steps to subclasses. The template method pattern allows subclasses to redefine certain steps of an algorithm without changing its structure.

![](../../assets/article/designPattern/模板.png)

**Example:**

Template method mode usage scenario

The template approach pattern is often used by the architect to build the framework of the project. The architect defines the skeleton of the framework and the programmer inherits the structure of the framework and is responsible for filling in the blanks
Hook method: Hook functions in various frameworks often specify the name of each hook function and the execution time at initialization, and users only need to inject custom logic code into the hook function
- Callback function: The callback function is executed at a specific time, but the specific operation is implemented by the specific function. Encapsulate the changes into a function and the rest becomes a template

The specific application of template method pattern is divided into three categories:

- Abstract method: An abstract method is declared by an abstract class and implemented by its concrete subclasses.

- Concrete method: A concrete method is declared and implemented by an abstract or concrete class, and its subclasses can be overridden or directly inherited.

- Hook method: A hook method is declared and implemented by an abstract or concrete class, and its subclasses may extend it. Usually the implementation given in the parent class is an empty implementation that is used as the default implementation for the method, although the hook method can also provide a non-empty default implementation. The hook method implemented in the subclass constrains the execution of the parent class method, and realizes the reverse control of the subclass to the parent class behavior.

Make a cup of coffee

First let's make a cup of coffee, generally speaking, the steps of making coffee are usually as follows:

1. Boil the water first.

2. Brew coffee with boiling water;

3. Pour the coffee into the cup;

4. Add sugar and milk.

Let's use es5 to get a cup of coffee:

```js
var Coffee = function () {};
Coffee.prototype.boilWater = function () {
  console.log('The water is boiling');
};
Coffee.prototype.brewCoffeeGriends = function () {
  console.log('Brew coffee with boiling water');
};
Coffee.prototype.pourInCup = function () {
  console.log('Pour the coffee into the cup');
};
Coffee.prototype.addSugarAndMilk = function () {
  console.log('Add sugar and milk');
};
// Encapsulation hands over the implementation details to the internals of the class
Coffee.prototype.init = function () {
  this.boilWater();
  this.brewCoffeeGriends();
  this.pourInCup();
  this.addSugarAndMilk();
};
var coffee = new Coffee();
coffee.init();
```

Make a pot of tea

In fact, the steps for making tea are not very different from those for making coffee, which is roughly like this:

1. Boil the water;

2. Soak tea leaves in boiling water;

3. Pour the tea into the cup;

4. Add lemon.

Here, let's make tea with es6:

```js
class Tea {
  constructor() {}
  boilWater() {
    console.log('Bring water to a boil');
  }
  steepTeaBag() {
    console.log('Soaked tea leaves');
  }
  pourInCup() {
    console.log('Pour into a cup');
  }
  addLemon() {
    console.log('Add lemon');
  }
  init() {
    this.boilWater();
    this.steepTeaBag();
    this.pourInCup();
    this.addLemon();
  }
}
var tea = new Tea();
tea.init();
```

Now it's time to think, we just made a cup of coffee and a pot of tea, do you think these two processes are much the same. We can easily find out what they have in common, the difference is the raw material, tea and coffee, we can abstract them as "drinks" wow; The way of soaking is different, one is brewing, the other is soaking, we can abstract this behavior as "soaking"; The spices added are also different, adding sugar and milk, adding lemon, they can also be abstracted as "seasoning".

Such an analysis, is not very clear acriz, we sort it out is:

1. Boil the water;

2. Brew drinks with boiling water;

3. Pour the drink into the glass;

Step 4 Add seasoning.

Attention, everyone! Attention, everyone! Here comes the hero! We've thrown out the concept before, so we can now create an abstract superclass to represent the process of making a drink. So, abstract superclasses?

An abstract class?

Abstract classes cannot be instantiated; they must be inherited. All subclasses that inherit an abstract class will have interface methods identical to those of the abstract class, and the main role of the abstract class is to define these public interfaces for its subclasses.

Through the above analysis, it is specifically to find out the common steps of making tea and making coffee, encapsulate them into the parent class, that is, the abstract class, and then write different steps in the subclass, that is, tea and coffee. Since an abstract class cannot be instantiated, no fear, a subclass is its instantiation.

Make a drink!

```js
var Beverage = function () {};
Beverage.prototype.boilWater = function () {
  console.log('Boil the water');
};
Beverage.prototype.brew = function () {};
Beverage.prototype.pourInCup = function () {};
Beverage.prototype.addCondiments = function () {};
// Abstract method
Beverage.prototype.init = function () {
  this.boilWater();
  this.brew();
  this.pourInCup();
  this.addCondiments();
};
var Coffee = function () {
  // Take the constructor of the parent class and execute it
  Beverage.apply(this, arguments);
  // Just like es6's super execution, this will only have the properties of the object after execution
};
Coffee.prototype = new Beverage();
var coffee = new Coffee();
coffee.init();
var Tea = function () {};
Tea.prototype = new Beverage();
Tea.prototype.brew = function () {
  console.log('Soak the tea leaves in boiling water');
};
Tea.prototype.pourInCup = function () {
  console.log('Pour the tea into the cup');
};
Tea.prototype.addCondiments = function () {
  console.log('Add lemon');
};
var tea = new Tea();
tea.init();
```

Both coffee and tea are made here, is it not as cumbersome as before, and the code here is very advanced.

Coffee and Tea are represented by the parent class Beverage, and then the subclass is Coffee and Tea, because Beverage is an abstract existence, and the subclass needs to inherit it. The process of brewing a drink can be understood as a template pattern, the abstract class Beverage, and the abstract method init() is implemented in the subclass. js inheritance is based on prototype chain inheritance, where prototype is the prototype chain of the class. Since there is no corresponding init() on the prototype of the coffee object and tea object, the request will follow the prototype chain to find the init() of the parent class Beverage. When subclasses look for corresponding properties and methods, they will follow the prototype chain to find them, first looking for themselves, and if they do not find them, they will follow the search inside the parent class.

The reason why Beverage.prototype.init is called a template method is that it encapsulates the algorithm framework of the subclass, which serves as a template for the algorithm and instructs the subclass to execute which methods in which order.

**Advantages:**

- Formally define an algorithm in the parent class, and let its subclasses implement the details of the processing, and the subclasses implement the detailed processing algorithm without changing the order of execution of the steps in the algorithm.
- Template method pattern is a code reuse technique, it is particularly important in class library design, it extracts the common behavior of the class library, puts the common behavior in the parent class, and through its subclasses to achieve different behavior, it encourages us to use inheritance properly to achieve code reuse.
A reverse control structure can be implemented where subclasses override the hook methods of the parent class to decide whether a particular step needs to be performed.
- In the template method pattern, the basic method of the parent class can be overridden by subclasses, different subclasses can provide different implementations of the basic method, and it is easy to replace and add new subclasses, which conforms to the principle of single responsibility and the principle of open and close.

**Disadvantage:**

- It is necessary to provide a subclass for different implementations of each basic method. If there are too many variable basic methods in the parent class, the number of classes will increase, the system will become larger, and the design will become more abstract. In this case, the bridge pattern can be combined to design.
- 
### 6.11 Visitor Pattern

> Visitor Pattern:Provides a representation of operations that act on elements of an object structure, which allows us to define new operations on those elements without changing their class. Visitor pattern is an object behavior pattern.

![](../../assets/article/designPattern/访问者.png)

**Example:**

Visitor pattern is a more complex behavioral design pattern, which consists of two main components: visitor and visited elements. These visited elements usually have different types, and different visitors can access them differently. The visitor pattern allows users to extend the functionality of the system without modifying the existing system, adding new operations to these different types of elements.

When using the visitor pattern, the accessed elements usually do not exist separately, they are stored in a collection called an "object structure", and the visitor iterates through the object structure to achieve a one-by-one operation on the elements stored in it.

```js
// Visitor pattern: DOM event binding
var bindEvent = function(dom, type, fn, data) {
    if (dom.addEventListener) {
        dom.addEventListener(type, fn, false);
    } else if (dom.attachEvent) {
        // dom.attachEvent('on'+type, fn);
        var data = data || {};
        dom.attachEvent('on' + type, function(e) {
            // In IE this points to window, use call to change the point of this
            fn.call(dom, e, data);
        });
    } else {
        dom['on' + type] = fn;
    }
}
function $(id) {
    return document.getElementById(id);
}
​
bindEvent($(demo), 'click', function() {
    // this points to the dom object
    this.style.background = 'red';
});
​
bindEvent($('btn'), 'click', function(e, data) {
    $('text').innerHTML = e.type + data.text + this.tagName;
}, { text: 'demo' });
```

The idea of visitor pattern is to add new operation methods to the operand without changing it, so as to achieve access to the operand. We know that the purpose of call and apply is to change the scope of function execution, which is the essence of the visitor pattern. call and apply are two ways to make an object run in another scope.

```js
// Array method encapsulation
var Visitor = (function() {
    return {
        splice: function() {
            var args = Array.prototype.splice.call(arguments, 1);
            return Array.prototype.splice.apply(arguments[0], args);
        },
        push: function() {
            var len = arguments[0].length || 0;
            var args = this.splice(arguments, 1);
            arguments[0].length = len + arguments.length - 1;
            return Array.prototype.push.apply(arguments[0], args);
        },
        pop: function() {
            return Array.prototype.pop.apply(arguments[0]);
        }
    }
})();
​
var a = new Object();
Visitor.push(a,1,2,3,4);
Visitor.push(a,4,5,6);
Visitor.pop(a);
Visitor.splice(a,2);
```

The visitor pattern solves the coupling between the data and the manipulation of the data, making the manipulation of the data independent of the data, so that it can freely evolve. Therefore, the visitor pattern is more suitable for those environments where the data is stable but the data manipulation method is variable.

**Advantages:**

- Easy to add new access operations. Using the visitor pattern, adding a new access operation means adding a new concrete visitor class, which is simple to implement without modifying the source code and conforms to the "open and closed principle".
- Centralize access to element objects into a single visitor object, rather than spreading it across individual element classes. Class responsibilities are clearer, facilitating reuse of element objects in the object structure, and the same object structure can be accessed by multiple different visitors.
- Enables users to define operations that act on an existing element class hierarchy without modifying it.

**Disadvantage:**

- Adding new element classes is difficult. In the visitor pattern, adding a new element class means adding a new abstract operation to the abstract visitor role and a corresponding concrete operation to each concrete visitor class, which violates the "open closed principle".
- Break the package. The visitor pattern requires the visitor object to access and invoke the operations of each element object, which means that the element object must sometimes expose some of its own internal operations and internal state, otherwise it cannot be accessed by the visitor.

## Sum up

After systematically studying design patterns, you can see in your past development experience that design patterns are everywhere. Before learning design patterns, we often rely on past experience and wisdom to improve the design of a system, and many of these experiences coincide with the idea of a certain design pattern.

There are still some places that are not fully understood, and I would like to point out the mistakes in the article.

## Reference material

- [Study-Plan](https://github.com/xietao3/Study-Plan)
- [javaScript 设计模式统计](https://zhuanlan.zhihu.com/p/472719016)
- [ES6 系列之我们来聊聊装饰器](https://juejin.cn/post/6844903713866252296)
- [设计模式之生成器模式](https://segmentfault.com/a/1190000038250020)
- [https://juejin.im/user/57f8ffda2e958a005581e3c0/posts](https://juejin.im/user/57f8ffda2e958a005581e3c0/posts)
- [https://design-patterns.readthedocs.io/zh_CN/latest/index.html](https://design-patterns.readthedocs.io/zh_CN/latest/index.html)
- [https://blog.csdn.net/lovelion/article/details/17517213](https://blog.csdn.net/lovelion/article/details/17517213)
- [https://github.com/skyming/Trip-to-iOS-Design-Patterns](https://github.com/skyming/Trip-to-iOS-Design-Patterns)
