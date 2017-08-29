interface Person {
    name: string;
    age: number;
}

type PersonPartial = Partial<Person>;
type ReadonlyPerson = Readonly<Person>;

var a:PersonPartial;
