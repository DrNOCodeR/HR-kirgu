// src/components/ApplyForm.jsx
import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import "../styles/vacancies.scss";

const API_URL = "http://localhost:5000/api/applications";

const ApplyForm = ({ vacancyId }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const messageRef = useRef(null);

  const handleAutoResize = () => {
    const el = messageRef.current;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const onSubmit = async (data) => {
    try {
      /* ===== 1. ЗАГРУЖАЕМ ФАЙЛ ===== */
      let resumePath = "NO_FILE";

      if (data.resume && data.resume[0]) {
        const formData = new FormData();
        formData.append("resume", data.resume[0]);

        const uploadRes = await axios.post(
          "http://localhost:5000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        resumePath = uploadRes.data.filePath;
      }

      /* ===== 2. СОХРАНЯЕМ ОТКЛИК ===== */
      const payload = {
        VacancyId: vacancyId,
        Fullname: data.fullName,
        Email: data.email,
        Phone: data.phone,
        Message: data.message || "-",
        ResumePath: resumePath,
      };

      await axios.post(API_URL, payload);

      alert("Ваш отклик отправлен!");
      reset();
    } catch (error) {
      console.error(error);
      alert("Ошибка при отправке отклика");
    }
  };

  return (
    <>
      <form className="apply-form" onSubmit={handleSubmit(onSubmit)}>
        {Object.keys(errors).length > 0 && (
          <div className="form-error-global">
            Пожалуйста, заполните обязательные поля
          </div>
        )}

        <input
          {...register("fullName", {
            required: "Введите ФИО*",
            minLength: { value: 3, message: "ФИО слишком короткое*" },
          })}
          placeholder="ФИО"
        />
        {errors.fullName && (
          <span className="form-error">{errors.fullName.message}</span>
        )}

        <input
          {...register("email", {
            required: "Введите Email*",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Некорректный Email*",
            },
          })}
          placeholder="Email"
        />
        {errors.email && (
          <span className="form-error">{errors.email.message}</span>
        )}

        <input
          {...register("phone", {
            required: "Введите телефон*",
            minLength: { value: 6, message: "Телефон слишком короткий*" },
          })}
          placeholder="Телефон"
        />
        {errors.phone && (
          <span className="form-error">{errors.phone.message}</span>
        )}

        <Controller
          name="message"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <textarea
              {...field}
              ref={(el) => {
                messageRef.current = el;
                field.ref(el);
              }}
              onInput={(e) => {
                field.onChange(e);
                handleAutoResize();
              }}
              placeholder="Сопроводительное письмо"
              className="auto-textarea"
            />
          )}
        />

        <input type="file" {...register("resume")} />

        <div className="consent-wrapper">
          <label className="checkbox-label">
            <input
              type="checkbox"
              {...register("consent", {
                required: "Необходимо согласие на обработку данных*",
              })}
            />
            <span>
              Даю согласие{" "}
              <span
                className="consent-link"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                на обработку персональных данных
              </span>
            </span>
          </label>

          {errors.consent && (
            <span className="form-error">{errors.consent.message}</span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Отправка..." : "Отправить отклик"}
        </button>
      </form>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <h2>Согласие на обработку персональных данных</h2>
            <ol>
              <li>
                Настоящим я, далее – «Субъект Персональных Данных», во
                исполнение требований Федерального закона от 27.07.2006 г. №
                152-ФЗ «О персональных данных» (с изменениями и дополнениями)
                свободно, своей волей и в своем интересе даю свое согласие
                обществу с ограниченной ответственностью «Интеллектуальные
                продукты» в лице «kirgu», далее – «Сайт», на обработку своих
                персональных данных, указанных при регистрации путем заполнения
                веб-формы на сайте Название, направляемой (заполненной) с
                использованием Сайта.
              </li>
              <li>
                Под персональными данными я понимаю любую информацию,
                относящуюся ко мне как к Субъекту Персональных Данных, в том
                числе мои фамилию, имя, отчество, адрес, образование, профессию,
                контактные данные (телефон, факс, электронная почта, почтовый
                адрес), фотографии, иную другую информацию. Под обработкой
                персональных данных я понимаю сбор, систематизацию, накопление,
                уточнение, обновление, изменение, использование,
                распространение, передачу, в том числе трансграничную,
                обезличивание, блокирование, уничтожение, бессрочное хранение и
                любые другие действия (операции) с персональными данными.
              </li>
              <li>
                Обработка персональных данных Субъекта Персональных Данных
                осуществляется исключительно в целях регистрации Субъекта
                Персональных Данных в базе данных сайта с последующим
                направлением Субъекту Персональных Данных почтовых сообщений и
                смс-уведомлений, в том числе рекламного содержания.
              </li>
              <li>
                Датой выдачи согласия на обработку персональных данных Субъекта
                Персональных Данных является дата отправки регистрационной
                веб-формы с сайта.
              </li>
              <li>
                Обработка персональных данных Субъекта Персональных Данных может
                осуществляться с помощью средств автоматизации и/или без
                использования средств автоматизации в соответствии с действующим
                законодательством РФ и внутренними положениями Сайта.
              </li>
              <li>
                Сайт принимает необходимые правовые, организационные и
                технические меры или обеспечивает их принятие для защиты
                персональных данных от неправомерного или случайного доступа к
                ним, уничтожения, изменения, блокирования, копирования,
                предоставления, распространения персональных данных, а также от
                иных неправомерных действий в отношении персональных данных, а
                также принимает на себя обязательство сохранения
                конфиденциальности персональных данных Субъекта Персональных
                Данных. Сайт вправе привлекать для обработки персональных данных
                Субъекта Персональных Данных субподрядчиков, а также вправе
                передавать персональные данные для обработки своим
                аффилированным лицам, обеспечивая при этом принятие такими
                субподрядчиками и аффилированными лицами соответствующих
                обязательств в части конфиденциальности персональных данных.
              </li>
              <li>
                Я ознакомлен(а), что:
                <ul>
                  <li>
                    настоящее согласие на обработку моих персональных данных,
                    указанных при регистрации на Сайте Название, направляемых
                    (заполненных) с использованием Cайта, действует в течение 20
                    (двадцати) лет с момента регистрации на Cайте;
                  </li>
                  <li>
                    согласие может быть отозвано мною на основании письменного
                    заявления в произвольной форме;
                  </li>
                  <li>
                    предоставление персональных данных третьих лиц без их
                    согласия влечет ответственность в соответствии с действующим
                    законодательством Российской Федерации. Утверждено и
                    действительно на сайте kirgu с «01.01.2022».
                  </li>
                </ul>
              </li>
            </ol>
            <button className="modal-ok" onClick={() => setIsModalOpen(false)}>
              Понятно
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplyForm;
