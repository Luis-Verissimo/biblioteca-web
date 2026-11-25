export class ErroDaApi extends Error {
  status: number;
  campo: string | undefined;

  constructor(status: number, mensagem: string, campo?: string) {
    super(mensagem);
    this.status = status;
    this.campo = campo;
  }
}
