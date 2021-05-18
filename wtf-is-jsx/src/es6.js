class SuperClass {
  #age = 20;
  setAge(age) {
  	this.#age = age;
  }
  getAge() {
    console.log(this.#age);
  }
}
// new SuperClass().#age