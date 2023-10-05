import IAnalyzerAnalyzeResult from '@/interfaces/modules/analyzer/analyzerAnalyzeResult';

export default interface IAnalyzerAnalyzeForm {
  text: string | undefined;
  result?: IAnalyzerAnalyzeResult;
}
