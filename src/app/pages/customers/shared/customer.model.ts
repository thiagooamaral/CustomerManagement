export class Customer {
    constructor(
        public clienteId?: number,
        public nome?: string,
        public nascimento?: string,
        public sexo?: number,
        public estadoCivil?: number,
        public ativo?: boolean
    ){}

    static genderList = {
        0: 'Feminino',
        1: 'Masculino'
    };

    static civilStatusList = {
        0: 'Solteiro',
        1: 'Casado',
        2: 'Divorciado',
        3: 'Viuvo'
    };

    get statusText(): string {
        return this.ativo ? 'Sim' : 'Não';
    }
}