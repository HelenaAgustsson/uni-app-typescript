import { pool } from './mysql-pool';

export class Student {
  id: number = 0;
  name: string = '';
  email: string = '';
  program_id: number = 0;
  program_name: string = '';
}

export class Program {
  id: number = 0;
  name: string = '';
}

class ProgramService {
  getPrograms(success: (programs: Program[]) => void) {
    pool.query('SELECT * FROM Programs', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }
  getProgram(id: number, success: (program: Program) => void) {
    pool.query('SELECT * FROM Programs WHERE id=?', [id], (error, results) => {
      if (error) return console.error(error);
      success(results[0]);
    });
  }
  getStudentProgram(id: number, success: (program: string) => void) {
    pool.query('SELECT * FROM Programs WHERE id=?', [id], (error, results) => {
      if (error) return console.error(error);
      if (!results[0]) {
        success('None');
      } else {
        success(results[0].name);
      }
    });
  }
  updateProgram(program: Program, success: () => void) {
    pool.query('UPDATE Programs SET name=? WHERE id=?', [program.name, program.id], (error) => {
      if (error) return console.error(error);
      success();
    });
  }
}

class StudentService {
  getStudents(success: (students: Student[]) => void) {
    pool.query('SELECT * FROM Students', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getStudentsAndPrograms(success: (students: Student[]) => void) {
    pool.query(
      'SELECT Students.id AS id, Students.name AS name, email, program_id, Programs.name AS program_name FROM Students INNER JOIN Programs ON Students.program_id = Programs.id',
      (error, results) => {
        if (error) return console.error(error);
        success(results);
      }
    );
  }

  getStudent(id: number, success: (student: Student) => void) {
    pool.query('SELECT * FROM Students WHERE id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  getStudentPrograms(id: number, success: (student: Student) => void) {
    pool.query(
      'SELECT Students.id AS id, Students.name AS name, email, program_id, Programs.name AS program_name FROM Students INNER JOIN Programs ON Students.program_id = Programs.id WHERE Students.id=?',
      [id],
      (error, results) => {
        if (error) return console.error(error);
        success(results[0]);
      }
    );
  }

  updateStudent(student: Student, success: () => void) {
    pool.query(
      'UPDATE Students SET name=?, email=? WHERE id=?',
      [student.name, student.email, student.id],
      (error) => {
        if (error) return console.error(error);

        success();
      }
    );
  }
}
export let studentService = new StudentService();
export let programService = new ProgramService();
