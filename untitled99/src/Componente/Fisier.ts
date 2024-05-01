interface Interface1 {
    field1: boolean;
    field2: number;
    field3: string;
    field4: string[];
    field5: Date;
}

interface Interface2 extends Interface1 {
    field6: string;
    field7: number;
    title: string;
    content: string;
    owner: string;
}

const myObject: Interface2 = {
    field1: true,
    field2: 126423425,
    field3: 'Card 4532',
    field4: ['Bob', 'Big'],
    field5: new Date(),
    field6: 'Value 6',
    field7: 20,
    title: 'Card 4532', // Adăugăm proprietatea 'title'
    content: 'Value 9', // Adăugăm proprietatea 'content'
    owner: 'Bob Big', // Adăugăm proprietatea 'owner'
};

export { myObject };
export type{ Interface2 };
